/**
 * Historic Battles Fetcher
 *
 * Walks `battle.getBattles` backward in time (newest -> oldest) using cursor
 * pagination, persisting each page to its own JSON file. Re-running with a new
 * (older) target date resumes from the oldest already-saved page using the
 * `nextCursor` stored in that file.
 *
 * Output dir: examples/battles-data/
 * File naming: battles-<fromIso>-to-<toIso>.json
 *   - fromIso = createdAt of first battle in the page (newest in the page)
 *   - toIso   = createdAt of last  battle in the page (oldest in the page)
 *   - colons (":") in ISO timestamps are replaced with "-" for filesystem safety.
 *
 * Parallelism strategy:
 *   - Cursor pagination is inherently sequential per chain (each request needs
 *     the previous response's nextCursor), so requests cannot be fanned out.
 *   - Concurrency is achieved by pipelining: file writes happen in parallel
 *     with the next API call (writes are not awaited before firing the next
 *     request). The SDK's built-in rate limiter governs request throughput.
 *
 * Usage:
 *   npx ts-node examples/historic-battles-fetcher.ts <untilDateISO>
 *
 * Examples:
 *   npx ts-node examples/historic-battles-fetcher.ts 2026-01-01
 *   npx ts-node examples/historic-battles-fetcher.ts 2025-10-15T00:00:00Z
 */

import { createAPI } from "../src/client";
import { BattleDTO } from "../src/DTOs/battle.dto";
import fs from "fs";
import path from "path";

const API_BASE_URL = "https://api2.warera.io/trpc";
const OUTPUT_DIR = path.join(__dirname, "battles-data");
const PAGE_LIMIT = 100;
const DIRECTION = "backward";

interface SavedPage {
  fetchedAt: string;
  direction: typeof DIRECTION;
  fromTimestamp: string;
  toTimestamp: string;
  nextCursor?: string;
  itemCount: number;
  items: BattleDTO[];
}

function sanitizeIsoForFilename(iso: string): string {
  return iso.replace(/:/g, "-");
}

function pageFilename(fromIso: string, toIso: string): string {
  return `battles-${sanitizeIsoForFilename(fromIso)}-to-${sanitizeIsoForFilename(
    toIso
  )}.json`;
}

/**
 * Find the saved page whose `toTimestamp` is the OLDEST on disk.
 * That page's `nextCursor` is what we need to keep walking backward in time.
 */
function findResumePage(): SavedPage | undefined {
  if (!fs.existsSync(OUTPUT_DIR)) return undefined;

  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith("battles-") && f.endsWith(".json"));

  let resume: SavedPage | undefined;
  let oldestTime = Infinity;

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(OUTPUT_DIR, file), "utf-8");
      const page = JSON.parse(raw) as SavedPage;
      if (!page.toTimestamp) continue;
      const t = new Date(page.toTimestamp).getTime();
      if (Number.isNaN(t)) continue;
      if (t < oldestTime) {
        oldestTime = t;
        resume = page;
      }
    } catch {
      // ignore unreadable files
    }
  }

  return resume;
}

async function main() {
  const untilArg = process.argv[2];
  if (!untilArg) {
    console.error(
      "Usage: ts-node examples/historic-battles-fetcher.ts <untilDateISO>"
    );
    process.exit(1);
  }

  const untilDate = new Date(untilArg);
  if (Number.isNaN(untilDate.getTime())) {
    console.error(`Invalid date: ${untilArg}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const api = createAPI({
    baseUrl: API_BASE_URL,
    cache: null,
    rateLimitConfig: {
      maxRequests: 60,
      windowMs: 60_000,
      backoffThreshold: 0.7,
      maxBackoffMs: 3_000,
    },
  });

  let cursor: string | undefined;
  const resume = findResumePage();
  if (resume) {
    if (!resume.nextCursor) {
      console.log(
        `Oldest saved page (${resume.toTimestamp}) has no nextCursor; nothing more to fetch backward.`
      );
      return;
    }
    const resumeOldest = new Date(resume.toTimestamp);
    if (resumeOldest <= untilDate) {
      console.log(
        `Already covered down to ${resume.toTimestamp}, which is at/before target ${untilDate.toISOString()}. Nothing to do.`
      );
      return;
    }
    cursor = resume.nextCursor;
    console.log(
      `Resuming backward walk from ${resume.toTimestamp} using stored nextCursor.`
    );
  } else {
    console.log("No prior pages found; starting from the newest battles.");
  }

  console.log(`Target stop date (inclusive): ${untilDate.toISOString()}\n`);

  const writePromises: Promise<void>[] = [];
  let pageIndex = 0;
  let totalItems = 0;

  while (true) {
    pageIndex += 1;

    const response = await api.battle.getBattles({
      limit: PAGE_LIMIT,
      cursor,
      direction: DIRECTION,
    });

    const items = response.result.data.items ?? [];
    const nextCursor = response.result.data.nextCursor;

    if (items.length === 0) {
      console.log(`Page ${pageIndex}: empty response, stopping.`);
      break;
    }

    const fromTs = items[0].createdAt;
    const toTs = items[items.length - 1].createdAt;

    const page: SavedPage = {
      fetchedAt: new Date().toISOString(),
      direction: DIRECTION,
      fromTimestamp: fromTs,
      toTimestamp: toTs,
      nextCursor,
      itemCount: items.length,
      items,
    };

    const outPath = path.join(OUTPUT_DIR, pageFilename(fromTs, toTs));

    writePromises.push(
      fs.promises
        .writeFile(outPath, JSON.stringify(page, null, 2))
        .then(() => {
          console.log(
            `   ✓ wrote ${path.basename(outPath)} (${items.length} battles)`
          );
        })
        .catch((err) => {
          console.error(`   ✗ failed to write ${outPath}:`, err);
        })
    );

    totalItems += items.length;
    const status = api.getRateLimitStatus();
    console.log(
      `Page ${pageIndex}: ${items.length} battles, ${fromTs} -> ${toTs}` +
        (status ? ` [rl ${status.usagePercent ?? "?"}%]` : "")
    );

    const oldestInPage = new Date(toTs);
    if (oldestInPage <= untilDate) {
      console.log(
        `Reached target date: oldest in page (${toTs}) <= until (${untilDate.toISOString()}).`
      );
      break;
    }

    if (!nextCursor) {
      console.log("No nextCursor returned; reached end of available history.");
      break;
    }

    cursor = nextCursor;
  }

  await Promise.all(writePromises);

  console.log(
    `\nDone. Fetched ${pageIndex} page(s), ${totalItems} battle(s) this run.`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
