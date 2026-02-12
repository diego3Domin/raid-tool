/**
 * Skills Scraping Script
 *
 * Scrapes champion skill data from InTeleria detail pages and updates champions.json.
 * Only updates champions that currently have empty skills arrays.
 *
 * Usage: npx tsx scripts/scrape-skills.ts
 *
 * Features:
 * - Rate-limited (300ms between requests)
 * - Progressive saving (saves every 50 champions)
 * - Resumable (skips champions that already have skills)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const CHAMPIONS_PATH = resolve(__dirname, "../src/data/champions.json");
const BATCH_DELAY = 300; // ms between requests
const SAVE_INTERVAL = 50; // save every N champions

interface ChampionSkill {
  name: string;
  description: string;
  cooldown?: number;
}

interface Champion {
  id: string;
  name: string;
  slug: string;
  faction: string;
  affinity: string;
  rarity: string;
  role: string;
  avatar_url: string;
  stats: Record<string, unknown>;
  skills: ChampionSkill[];
  ratings: Record<string, unknown>;
}

/** Build a map of champion name -> InTeleria slug from the API */
async function fetchInTeleriaSlugs(): Promise<Map<string, string>> {
  console.log("Fetching InTeleria champion list for slug mapping...");
  const res = await fetch("https://www.inteleria.com/wp-json/in-champions/v1/champions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ length: 1200 }),
  });
  if (!res.ok) throw new Error(`InTeleria returned ${res.status}`);
  const json = await res.json();

  const slugMap = new Map<string, string>();
  for (const item of json.data) {
    // Extract name from HTML: <a href='...'>Champion Name</a>...
    const nameMatch = item.name.match(/>([^<]+)</);
    const name = nameMatch ? decodeHtmlEntities(nameMatch[1].trim()) : "";

    // Extract slug from href: https://www.inteleria.com/champion-list/slug/
    const hrefMatch = item.name.match(/href='([^']+)'/);
    if (hrefMatch) {
      const slug = hrefMatch[1].replace(/.*champion-list\//, "").replace(/\/$/, "");
      if (name && slug) {
        slugMap.set(normalizeName(name), slug);
      }
    }
  }
  console.log(`  Found ${slugMap.size} InTeleria slugs`);
  return slugMap;
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

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014");
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Parse skills from an InTeleria champion detail page HTML */
function parseSkills(html: string): ChampionSkill[] {
  const skills: ChampionSkill[] = [];

  // Match each <div class="skills"> block
  const skillRegex = /<div class="skills">([\s\S]*?)<\/div>/g;
  let match;

  while ((match = skillRegex.exec(html)) !== null) {
    const block = match[1];

    // Extract skill name from <h5><b>Name</b>
    const nameMatch = block.match(/<h5><b>([^<]+)<\/b>/);
    if (!nameMatch) continue;
    const name = decodeHtmlEntities(nameMatch[1].trim());

    // Skip "Aura" as it's not a real skill (it's a passive aura)
    // But keep passive skills marked with [P]

    // Extract cooldown from <span ...>(Cooldown: N)</span>
    const cooldownMatch = block.match(/\(Cooldown:\s*(\d+)\)/);
    const cooldown = cooldownMatch ? parseInt(cooldownMatch[1]) : undefined;

    // Extract description from <p>...</p>
    const descMatch = block.match(/<p>([\s\S]*?)<\/p>/);
    if (!descMatch) continue;

    let description = stripHtml(descMatch[1]);
    // Clean up the description — remove "Damage based on:" and "Upgrades:" sections
    const damageIdx = description.indexOf("Damage based on:");
    const upgradesIdx = description.indexOf("Upgrades:");
    const cutIdx = Math.min(
      damageIdx >= 0 ? damageIdx : Infinity,
      upgradesIdx >= 0 ? upgradesIdx : Infinity
    );
    if (cutIdx < Infinity) {
      description = description.substring(0, cutIdx).trim();
    }

    if (name && description) {
      skills.push({ name, description, ...(cooldown !== undefined && { cooldown }) });
    }
  }

  return skills;
}

/** Fetch and parse skills for a single champion from InTeleria */
async function fetchChampionSkills(itSlug: string): Promise<ChampionSkill[]> {
  const url = `https://www.inteleria.com/champion-list/${itSlug}/`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const html = await res.text();
    return parseSkills(html);
  } catch {
    return [];
  }
}

async function main() {
  console.log("=== InTeleria Skills Scraper ===\n");

  // Load existing champions
  const champions: Champion[] = JSON.parse(readFileSync(CHAMPIONS_PATH, "utf-8"));
  const needSkills = champions.filter((c) => !c.skills || c.skills.length === 0);
  console.log(`Total champions: ${champions.length}`);
  console.log(`Already have skills: ${champions.length - needSkills.length}`);
  console.log(`Need skills: ${needSkills.length}\n`);

  if (needSkills.length === 0) {
    console.log("All champions already have skills. Nothing to do.");
    return;
  }

  // Get InTeleria slug mapping
  const slugMap = await fetchInTeleriaSlugs();

  let fetched = 0;
  let failed = 0;
  let noMapping = 0;

  for (let i = 0; i < needSkills.length; i++) {
    const champ = needSkills[i];
    const normalized = normalizeName(champ.name);
    const itSlug = slugMap.get(normalized);

    if (!itSlug) {
      // Try using our slug directly as fallback
      const fallbackSlug = champ.slug;
      const skills = await fetchChampionSkills(fallbackSlug);
      if (skills.length > 0) {
        champ.skills = skills;
        fetched++;
        process.stdout.write(`  [${i + 1}/${needSkills.length}] ${champ.name}: ${skills.length} skills (fallback slug)\n`);
      } else {
        noMapping++;
        process.stdout.write(`  [${i + 1}/${needSkills.length}] ${champ.name}: no InTeleria mapping\n`);
      }
    } else {
      const skills = await fetchChampionSkills(itSlug);
      if (skills.length > 0) {
        champ.skills = skills;
        fetched++;
        process.stdout.write(`  [${i + 1}/${needSkills.length}] ${champ.name}: ${skills.length} skills\n`);
      } else {
        failed++;
        process.stdout.write(`  [${i + 1}/${needSkills.length}] ${champ.name}: no skills found on page\n`);
      }
    }

    // Progressive save
    if ((i + 1) % SAVE_INTERVAL === 0) {
      writeFileSync(CHAMPIONS_PATH, JSON.stringify(champions, null, 2));
      console.log(`  --- Saved progress (${i + 1}/${needSkills.length}) ---`);
    }

    // Rate limiting
    await new Promise((r) => setTimeout(r, BATCH_DELAY));
  }

  // Final save
  writeFileSync(CHAMPIONS_PATH, JSON.stringify(champions, null, 2));

  console.log(`\n=== Results ===`);
  console.log(`Skills fetched: ${fetched}`);
  console.log(`Failed (page exists but no skills parsed): ${failed}`);
  console.log(`No InTeleria mapping: ${noMapping}`);
  console.log(`Total with skills now: ${champions.filter((c) => c.skills.length > 0).length}/${champions.length}`);
}

main().catch(console.error);
