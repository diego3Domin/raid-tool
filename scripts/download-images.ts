/**
 * Download all champion images from external URLs and store locally.
 * Updates champions.json with local image paths.
 *
 * Usage: npx tsx scripts/download-images.ts
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

interface Champion {
  id: string;
  name: string;
  slug: string;
  avatar_url: string;
  [key: string]: unknown;
}

const DATA_PATH = path.join(__dirname, "../src/data/champions.json");
const IMG_DIR = path.join(__dirname, "../public/champions");
const PLACEHOLDER_PATH = "/champions/placeholder.svg";
const DELAY_MS = 200; // Rate limit

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getExtension(url: string): string {
  const match = url.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?|$)/i);
  return match ? match[1].toLowerCase() : "png";
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, { timeout: 15000 }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve);
        return;
      }

      if (res.statusCode !== 200) {
        console.warn(`  HTTP ${res.statusCode} for ${url}`);
        resolve(false);
        return;
      }

      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        resolve(true);
      });
      stream.on("error", () => {
        fs.unlinkSync(dest);
        resolve(false);
      });
    });

    request.on("error", () => {
      resolve(false);
    });

    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const champions: Champion[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let noUrl = 0;
  const failures: string[] = [];

  console.log(`Processing ${champions.length} champions...`);

  for (let i = 0; i < champions.length; i++) {
    const champ = champions[i];

    if (!champ.avatar_url) {
      champ.avatar_url = PLACEHOLDER_PATH;
      noUrl++;
      continue;
    }

    const ext = getExtension(champ.avatar_url);
    const filename = `${champ.slug}.${ext}`;
    const localPath = `/champions/${filename}`;
    const destPath = path.join(IMG_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      if (stat.size > 100) {
        champ.avatar_url = localPath;
        skipped++;
        continue;
      }
    }

    process.stdout.write(`[${i + 1}/${champions.length}] ${champ.name}... `);

    const ok = await downloadFile(champ.avatar_url, destPath);
    if (ok) {
      champ.avatar_url = localPath;
      downloaded++;
      console.log("OK");
    } else {
      failures.push(champ.name);
      champ.avatar_url = PLACEHOLDER_PATH;
      failed++;
      console.log("FAILED");
    }

    // Save progress every 100 champions
    if ((i + 1) % 100 === 0) {
      fs.writeFileSync(DATA_PATH, JSON.stringify(champions, null, 2));
      console.log(`  --- Saved progress (${i + 1}/${champions.length}) ---`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  fs.writeFileSync(DATA_PATH, JSON.stringify(champions, null, 2));

  console.log("\n=== DONE ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`No URL (placeholder): ${noUrl}`);

  if (failures.length > 0) {
    console.log("\nFailed champions:");
    failures.forEach((n) => console.log(`  - ${n}`));
  }
}

main().catch(console.error);
