/**
 * Country Finances Scraper
 *
 * This script fetches weekly income and spending data for all countries
 * using the InventoryAccount.getInventoryAccounts endpoint and saves it to a JSON file.
 *
 * Usage:
 *   npx ts-node examples/country-finances-scraper.ts [weeks]
 *
 * Arguments:
 *   weeks - Number of weeks of historical data to fetch (1-52, default: 4)
 *
 * Examples:
 *   npx ts-node examples/country-finances-scraper.ts        # Last 4 weeks
 *   npx ts-node examples/country-finances-scraper.ts 12     # Last 12 weeks
 *   npx ts-node examples/country-finances-scraper.ts 52     # Full year
 */

import { createAPI } from "../src/client";
import fs from "fs";
import path from "path";

// ============================================================================
// Types
// ============================================================================

interface SpendingBreakdown {
  total: number;
  construction: number;
  upgradeMaintenance: number;
  alliances: number;
  enemy: number;
  lawEnacting: number;
  setOrders: number;
  battleOrder: number;
  battleMercenaryPool: number;
  regionBuy: number;
  tradingMarket: number;
  transferToCountry: number;
  [key: string]: number;
}

interface IncomeBreakdown {
  total: number;
  regionsDevelopment: number;
  marketTaxes: number;
  incomeTaxes: number;
  hijackedRegionsDevelopment: number;
  hijackedIncomeTaxes: number;
  battleMercenaryPool: number;
  donation: number;
  transferToCountry: number;
  tradingMarket: number;
  regionBuy: number;
  [key: string]: number;
}

interface WeeklyRecord {
  yearWeek: string;
  spending: Partial<SpendingBreakdown>;
  incomes: Partial<IncomeBreakdown>;
  total: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface CountryFinanceSummary {
  countryId: string;
  countryName: string;
  countryCode: string;
  weeklyRecords: WeeklyRecord[];
  aggregated: {
    totalIncome: number;
    totalSpending: number;
    netBalance: number;
    incomeByCategory: Partial<IncomeBreakdown>;
    spendingByCategory: Partial<SpendingBreakdown>;
  };
}

interface ScrapedData {
  scrapedAt: string;
  weeksRequested: number;
  yearWeeksIncluded: string[];
  countries: CountryFinanceSummary[];
  allIncomeCategories: string[];
  allSpendingCategories: string[];
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Parse command line arguments
 */
function parseArgs(): { weeks: number } {
  const args = process.argv.slice(2);
  let weeks = 4; // Default to 4 weeks

  if (args.length > 0) {
    const parsedWeeks = parseInt(args[0], 10);
    if (!isNaN(parsedWeeks) && parsedWeeks >= 1 && parsedWeeks <= 52) {
      weeks = parsedWeeks;
    } else {
      console.warn(
        `Invalid weeks value "${args[0]}". Must be 1-52. Defaulting to 4 weeks.`
      );
    }
  }

  return { weeks };
}

/**
 * Get all yearWeek strings for the last N weeks (including current)
 */
function getLastNWeeks(n: number): string[] {
  const weeks: string[] = [];
  const now = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    weeks.push(`${date.getFullYear()}-${weekNumber.toString().padStart(2, "0")}`);
  }

  return weeks;
}

/**
 * Check if a yearWeek is within the requested range
 */
function isWithinRange(yearWeek: string, validWeeks: Set<string>): boolean {
  return validWeeks.has(yearWeek);
}

/**
 * Aggregate weekly records into totals
 */
function aggregateRecords(records: WeeklyRecord[]): CountryFinanceSummary["aggregated"] {
  const incomeByCategory: Partial<IncomeBreakdown> = {};
  const spendingByCategory: Partial<SpendingBreakdown> = {};
  let totalIncome = 0;
  let totalSpending = 0;

  for (const record of records) {
    // Aggregate incomes
    if (record.incomes) {
      for (const [category, amount] of Object.entries(record.incomes)) {
        if (typeof amount === "number") {
          incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
          totalIncome += amount;
        }
      }
    }

    // Aggregate spending (values are negative in the API)
    if (record.spending) {
      for (const [category, amount] of Object.entries(record.spending)) {
        if (typeof amount === "number" && category !== "total") {
          // Store as absolute value for clarity
          const absAmount = Math.abs(amount);
          spendingByCategory[category] = (spendingByCategory[category] || 0) + absAmount;
          totalSpending += absAmount;
        }
      }
    }
  }

  return {
    totalIncome,
    totalSpending,
    netBalance: totalIncome - totalSpending,
    incomeByCategory,
    spendingByCategory,
  };
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Main Script
// ============================================================================

const API_BASE_URL = "https://api2.warera.io/trpc";

async function main(): Promise<void> {
  const { weeks } = parseArgs();
  const OUTPUT_FILE = `country-finances-${weeks}w.json`;

  console.log("=".repeat(60));
  console.log(`Country Finances Scraper - Last ${weeks} week(s)`);
  console.log("=".repeat(60));
  console.log();

  // Calculate valid year-weeks
  const validWeeks = new Set(getLastNWeeks(weeks));
  console.log(`Target weeks: ${[...validWeeks].reverse().join(", ")}`);
  console.log();

  // Create API client with rate limiting
  const api = createAPI({
    baseUrl: API_BASE_URL,
    cache: null, // Disable caching to get fresh data
    rateLimit: {
      maxRequests: 30,
      windowMs: 60000,
      backoffThreshold: 0.7,
      maxBackoffMs: 3000,
      throwOnLimit: false,
    },
  });

  // Fetch all countries
  console.log("Fetching all countries...");
  const countriesResponse = await api.country.getAllCountries();
  const countries = countriesResponse.result.data;
  console.log(`Found ${countries.length} countries`);
  console.log();

  // Track all categories seen
  const allIncomeCategories = new Set<string>();
  const allSpendingCategories = new Set<string>();
  const yearWeeksFound = new Set<string>();

  // Fetch inventory accounts for each country
  const results: CountryFinanceSummary[] = [];

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const progress = `[${i + 1}/${countries.length}]`;

    process.stdout.write(`${progress} ${country.name} (${country.code})... `);

    try {
      const response = await api.inventoryAccount.getInventoryAccounts({
        countryId: country._id,
      });

      const allRecords = response.result.data;

      // Filter to only requested weeks
      const filteredRecords: WeeklyRecord[] = allRecords
        .filter((record) => isWithinRange(record.yearWeek, validWeeks))
        .map((record) => {
          // Track categories
          if (record.incomes) {
            Object.keys(record.incomes).forEach((k) => allIncomeCategories.add(k));
          }
          if (record.spending) {
            Object.keys(record.spending)
              .filter((k) => k !== "total")
              .forEach((k) => allSpendingCategories.add(k));
          }
          yearWeeksFound.add(record.yearWeek);

          return {
            yearWeek: record.yearWeek,
            spending: record.spending || {},
            incomes: record.incomes || {},
            total: record.total,
            balance: record.balance,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          };
        })
        .sort((a, b) => a.yearWeek.localeCompare(b.yearWeek));

      const aggregated = aggregateRecords(filteredRecords);

      results.push({
        countryId: country._id,
        countryName: country.name,
        countryCode: country.code,
        weeklyRecords: filteredRecords,
        aggregated,
      });

      console.log(
        `${filteredRecords.length} weeks, ` +
          `Income: ${aggregated.totalIncome.toFixed(2)}, ` +
          `Spending: ${aggregated.totalSpending.toFixed(2)}`
      );
    } catch (error) {
      console.log(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
      results.push({
        countryId: country._id,
        countryName: country.name,
        countryCode: country.code,
        weeklyRecords: [],
        aggregated: {
          totalIncome: 0,
          totalSpending: 0,
          netBalance: 0,
          incomeByCategory: {},
          spendingByCategory: {},
        },
      });
    }

    // Small delay to be nice to the server
    await sleep(100);
  }

  // Sort results by total income descending
  results.sort((a, b) => b.aggregated.totalIncome - a.aggregated.totalIncome);

  // Compile final data
  const scrapedData: ScrapedData = {
    scrapedAt: new Date().toISOString(),
    weeksRequested: weeks,
    yearWeeksIncluded: [...yearWeeksFound].sort(),
    countries: results,
    allIncomeCategories: [...allIncomeCategories].sort(),
    allSpendingCategories: [...allSpendingCategories].sort(),
  };

  // Write to file
  const outputPath = path.join(__dirname, OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(scrapedData, null, 2));

  // Print summary
  console.log();
  console.log("=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));
  console.log(`Output file: ${outputPath}`);
  console.log(`Countries processed: ${results.length}`);
  console.log(`Year-weeks found: ${[...yearWeeksFound].sort().join(", ")}`);
  console.log();

  // Top 10 by income
  console.log("Top 10 Countries by Income:");
  console.log("-".repeat(60));
  results.slice(0, 10).forEach((c, i) => {
    console.log(
      `${(i + 1).toString().padStart(2)}. ${c.countryName.padEnd(25)} ` +
        `Income: ${c.aggregated.totalIncome.toFixed(2).padStart(12)} | ` +
        `Spending: ${c.aggregated.totalSpending.toFixed(2).padStart(12)} | ` +
        `Net: ${c.aggregated.netBalance.toFixed(2).padStart(12)}`
    );
  });
  console.log();

  // Category summary
  console.log("Income Categories Found:");
  console.log([...allIncomeCategories].sort().join(", "));
  console.log();
  console.log("Spending Categories Found:");
  console.log([...allSpendingCategories].sort().join(", "));
  console.log();

  // Global totals
  const globalTotalIncome = results.reduce((sum, c) => sum + c.aggregated.totalIncome, 0);
  const globalTotalSpending = results.reduce((sum, c) => sum + c.aggregated.totalSpending, 0);
  console.log("Global Totals:");
  console.log(`  Total Income:   ${globalTotalIncome.toFixed(2)}`);
  console.log(`  Total Spending: ${globalTotalSpending.toFixed(2)}`);
  console.log(`  Net Balance:    ${(globalTotalIncome - globalTotalSpending).toFixed(2)}`);
}

main().catch(console.error);

