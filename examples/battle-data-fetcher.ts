/**
 * Battle Data Fetcher
 *
 * This script fetches all available battle data:
 * - All battles list
 * - Live battle data
 * - Detailed information for each battle
 * - Battle rankings
 *
 * Usage:
 *   npx ts-node examples/battle-data-fetcher.ts
 */

import { createAPI } from "../src/client";
import fs from "fs";
import path from "path";

const API_BASE_URL = "https://api2.warera.io/trpc";
async function main() {
  const api = createAPI({
    baseUrl: API_BASE_URL,
    cache: null, // Disable caching for fresh data
    rateLimit: {
      maxRequests: 60,
      windowMs: 60000,
      backoffThreshold: 0.7,
      maxBackoffMs: 3000,
    },
  });

  console.log("📊 Fetching all battle data...\n");

  // Fetch all battles
  console.log("1️⃣  Fetching battles list...");
  const battlesResponse = await api.battle.getBattles({ isActive: true });
  const battles = battlesResponse.result.data.items;
  console.log(`   ✓ Found ${battles.length} battles\n`);

  // Fetch live battle data
  console.log("2️⃣  Fetching live battle data...");
  const liveBattles = await api.battle.getLiveBattleData();
  console.log(`   ✓ Fetched live battle data\n`);

  // Fetch detailed data for each battle
  console.log("3️⃣  Fetching detailed data for each battle...");
  const battleDetails = [];
  for (const battle of battles) {
    const details = await api.battle.getById(battle._id);
    battleDetails.push(details);
    console.log(`   ✓ Fetched details for battle ${battle._id}`);
  }
  console.log();

  // Fetch battle rankings
  console.log("4️⃣  Fetching battle rankings...");
  const rankings = await api.battleRanking.getRanking();
  console.log(`   ✓ Fetched battle rankings\n`);

  // Compile all data
  const liveBattlesCount = Array.isArray(liveBattles)
    ? liveBattles.length
    : Object.keys(liveBattles).length;
  const rankingsCount = Array.isArray(rankings)
    ? rankings.length
    : Object.keys(rankings).length;

  const allBattleData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBattles: battles.length,
      liveBattlesCount,
      rankingsCount,
    },
    battles,
    liveBattles,
    battleDetails,
    rankings,
  };

  // Save to file
  const outputPath = path.join(__dirname, "battle-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(allBattleData, null, 2));
  console.log(`✅ All battle data saved to: ${outputPath}`);

  // Display summary
  console.log("\n📋 Summary:");
  console.log(`   Total Battles: ${battles.length}`);
  console.log(`   Live Battles: ${liveBattlesCount}`);
  console.log(`   Ranked Battles: ${rankingsCount}`);
}

main().catch(console.error);
