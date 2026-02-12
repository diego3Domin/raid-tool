/**
 * Backfill skills for champions that are missing them.
 * Uses the corrected HellHades API (WordPress post `id`, not `heroId`).
 *
 * Usage: npx tsx scripts/backfill-skills.ts
 */

import fs from "fs";
import path from "path";

interface HHChampion {
  id: string; // WordPress post ID — correct key for skills API
  heroId: number; // In-game ID — does NOT work for most champions
  champion: string;
}

interface HHSkill {
  type: string;
  name: string;
  cooldown: string | number;
  description: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u201C\u201D]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSkills(id: number): Promise<HHSkill[]> {
  try {
    const res = await fetch(`https://hellhades.com/wp-json/hh-api/v3/raid/skills/${id}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const skills = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : Array.isArray(data) ? data : [];
    return skills;
  } catch {
    return [];
  }
}

async function main() {
  const DATA_PATH = path.join(__dirname, "../src/data/champions.json");
  const champions = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

  // Find champions missing skills
  const missing = champions.filter((c: any) => !c.skills || c.skills.length === 0);
  console.log(`Champions missing skills: ${missing.length}/${champions.length}`);

  if (missing.length === 0) {
    console.log("All champions have skills. Nothing to do.");
    return;
  }

  // Fetch HellHades champion list
  console.log("Fetching HellHades champion list...");
  const res = await fetch("https://hellhades.com/wp-json/hh-api/v3/champions?mode=all");
  const json = await res.json();
  const hhChampions: HHChampion[] = json.champions;
  console.log(`Got ${hhChampions.length} HellHades champions`);

  // Build lookup by normalized name
  const hhByName = new Map<string, HHChampion>();
  for (const hh of hhChampions) {
    hhByName.set(normalizeName(hh.champion), hh);
  }

  let filled = 0;
  let notFound = 0;
  let noSkills = 0;

  for (let i = 0; i < missing.length; i++) {
    const champ = missing[i];
    const hh = hhByName.get(normalizeName(champ.name));

    if (!hh) {
      notFound++;
      continue;
    }

    const skills = await fetchSkills(Number(hh.id));

    if (skills.length > 0) {
      champ.skills = skills.map((s) => ({
        name: s.name,
        description: stripHtml(s.description),
        cooldown: s.cooldown
          ? typeof s.cooldown === "number"
            ? s.cooldown
            : parseInt(s.cooldown) || undefined
          : undefined,
      }));
      filled++;
      process.stdout.write(`[${i + 1}/${missing.length}] ${champ.name}... OK (${skills.length} skills)\n`);
    } else {
      noSkills++;
      process.stdout.write(`[${i + 1}/${missing.length}] ${champ.name}... no skills returned\n`);
    }

    // Save every 50
    if ((filled + noSkills + notFound) % 50 === 0) {
      fs.writeFileSync(DATA_PATH, JSON.stringify(champions, null, 2));
      console.log(`  --- Saved progress ---`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 150));
  }

  // Final save
  fs.writeFileSync(DATA_PATH, JSON.stringify(champions, null, 2));

  const totalWithSkills = champions.filter((c: any) => c.skills && c.skills.length > 0).length;

  console.log("\n=== DONE ===");
  console.log(`Filled: ${filled}`);
  console.log(`Not found in HH: ${notFound}`);
  console.log(`No skills returned: ${noSkills}`);
  console.log(`Total with skills: ${totalWithSkills}/${champions.length}`);
}

main().catch(console.error);
