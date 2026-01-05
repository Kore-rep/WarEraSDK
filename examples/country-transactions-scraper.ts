/**
 * Country Transactions Scraper
 * 
 * This script fetches all countries and scrapes their transaction data
 * for the specified number of days, then writes the results to a JSON file.
 * 
 * Usage:
 *   npx ts-node examples/country-transactions-scraper.ts [days]
 * 
 * Examples:
 *   npx ts-node examples/country-transactions-scraper.ts        # Last 1 day (default)
 *   npx ts-node examples/country-transactions-scraper.ts 7      # Last 7 days
 *   npx ts-node examples/country-transactions-scraper.ts 30     # Last 30 days
 */

import { createAPI } from "../src/client";
import { TransactionDTO } from "../src/DTOs/transaction.dto";
import { CountryDto } from "../src/DTOs/country.dto";
import * as fs from "fs";
import * as path from "path";

// Configuration
const API_BASE_URL = "https://api2.warera.io/trpc";
const TRANSACTIONS_LIMIT = 50; // Per request
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Parse command-line arguments
function parseArgs(): { days: number } {
  const args = process.argv.slice(2);
  let days = 1; // Default to 1 day

  if (args.length > 0) {
    const parsed = parseInt(args[0], 10);
    if (isNaN(parsed) || parsed < 1) {
      console.error("❌ Invalid argument. Days must be a positive number.");
      console.error("Usage: npx ts-node examples/country-transactions-scraper.ts [days]");
      process.exit(1);
    }
    days = parsed;
  }

  return { days };
}

interface CountryTransactionSummary {
  countryId: string;
  countryName: string;
  countryCode: string;
  totalIncome: number;
  totalSpending: number;
  netFlow: number;
  transactionCount: number;
  transactions: TransactionDTO[];
  scrapedAt: string;
}

interface ScrapingResult {
  scrapedAt: string;
  periodStart: string;
  periodEnd: string;
  periodDays: number;
  totalCountries: number;
  countriesWithTransactions: number;
  totalTransactions: number;
  countries: CountryTransactionSummary[];
}


async function fetchCountryTransactions(
  api: ReturnType<typeof createAPI>,
  countryId: string,
  countryName: string,
  countryCode: string,
  cutoffDate: Date,
  days: number
): Promise<CountryTransactionSummary> {
  const transactions: TransactionDTO[] = [];
  let cursor: string | undefined;
  let hasMore = true;
  let pageCount = 0;
  const maxPages = 500; // Increased for longer periods

  console.log(`  📥 Fetching transactions for ${countryName} (${countryCode})...`);

  while (hasMore && pageCount < maxPages) {
    try {
      const response = await api.transaction.getPaginatedTransactions({
        countryId,
        limit: TRANSACTIONS_LIMIT,
        cursor,
        direction: "backward", // Most recent first
      });

      const items = response.result.data.items;
      
      if (items.length === 0) {
        hasMore = false;
        break;
      }

      // Filter transactions within the period
      for (const tx of items) {
        const txDate = new Date(tx.createdAt);
        if (txDate >= cutoffDate) {
          transactions.push(tx as TransactionDTO);
        } else {
          // If we've gone past our cutoff date, stop fetching
          hasMore = false;
          break;
        }
      }

      // Check if there's more data
      cursor = response.result.data.nextCursor;
      if (!cursor) {
        hasMore = false;
      }

      pageCount++;

      // Small delay to be respectful to the API
    } catch (error) {
      console.error(`    ❌ Error fetching page ${pageCount + 1}:`, error);
      hasMore = false;
    }
  }

  // Calculate income and spending
  let totalIncome = 0;
  let totalSpending = 0;

  for (const tx of transactions) {
    // Income: when this country receives money (sellerCountryId matches)
    if (tx.sellerCountryId === countryId) {
      totalIncome += tx.money;
    }
    // Spending: when this country spends money (buyerCountryId matches)
    if (tx.buyerCountryId === countryId) {
      totalSpending += tx.money;
    }
  }

  const summary: CountryTransactionSummary = {
    countryId,
    countryName,
    countryCode,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalSpending: Math.round(totalSpending * 100) / 100,
    netFlow: Math.round((totalIncome - totalSpending) * 100) / 100,
    transactionCount: transactions.length,
    transactions,
    scrapedAt: new Date().toISOString(),
  };

  const periodLabel = days === 1 ? "24 hours" : `${days} days`;
  if (transactions.length > 0) {
    console.log(`    ✅ Found ${transactions.length} transactions (Income: ${totalIncome.toFixed(2)}, Spending: ${totalSpending.toFixed(2)})`);
  } else {
    console.log(`    ⚪ No transactions in the last ${periodLabel}`);
  }

  return summary;
}

async function main(): Promise<void> {
  const { days } = parseArgs();
  const periodLabel = days === 1 ? "24 hours" : `${days} days`;
  const outputFile = `country-transactions-${days}d.json`;

  console.log("🔄 Country Transactions Scraper");
  console.log("=".repeat(60));
  console.log(`📆 Period: Last ${periodLabel}`);
  console.log();

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * ONE_DAY_MS);

  console.log(`📅 Date range: ${cutoffDate.toISOString()} to ${now.toISOString()}`);
  console.log();

  // Create API client with rate limiting
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

  try {
    // Step 1: Fetch all countries
    console.log("📡 Step 1: Fetching all countries...");
    const countriesResponse = await api.country.getAllCountries();
    const countries: CountryDto[] = countriesResponse.result.data;
    console.log(`   Found ${countries.length} countries\n`);

    // Step 2: Fetch transactions for each country
    console.log("📡 Step 2: Fetching transactions for each country...");
    console.log("-".repeat(60));

    const countryResults: CountryTransactionSummary[] = [];
    let processedCount = 0;

    for (const country of countries) {
      const result = await fetchCountryTransactions(
        api,
        country._id,
        country.name,
        country.code,
        cutoffDate,
        days
      );
      countryResults.push(result);
      processedCount++;

      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(`\n   Progress: ${processedCount}/${countries.length} countries processed\n`);
      }

      // Rate limit status check
      const rateLimitStatus = api.getRateLimitStatus();
      if (rateLimitStatus && rateLimitStatus.usagePercent > 80) {
        console.log(`   ⏳ Rate limit at ${rateLimitStatus.usagePercent}%, backing off...`);
      }
    }

    console.log("-".repeat(60));
    console.log();

    // Step 3: Compile results
    const countriesWithTransactions = countryResults.filter(
      (c) => c.transactionCount > 0
    );
    const totalTransactions = countryResults.reduce(
      (sum, c) => sum + c.transactionCount,
      0
    );

    const result: ScrapingResult = {
      scrapedAt: now.toISOString(),
      periodStart: cutoffDate.toISOString(),
      periodEnd: now.toISOString(),
      periodDays: days,
      totalCountries: countries.length,
      countriesWithTransactions: countriesWithTransactions.length,
      totalTransactions,
      countries: countryResults,
    };

    // Step 4: Write to JSON file
    const outputPath = path.join(__dirname, outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`💾 Results written to: ${outputPath}`);
    console.log();

    // Summary
    console.log("📊 Summary");
    console.log("=".repeat(60));
    console.log(`Period:                       Last ${periodLabel}`);
    console.log(`Total countries:              ${countries.length}`);
    console.log(`Countries with transactions:  ${countriesWithTransactions.length}`);
    console.log(`Total transactions:           ${totalTransactions}`);
    console.log();

    // Top 10 by income
    const topByIncome = [...countryResults]
      .filter((c) => c.totalIncome > 0)
      .sort((a, b) => b.totalIncome - a.totalIncome)
      .slice(0, 10);

    if (topByIncome.length > 0) {
      console.log(`💰 Top 10 Countries by Income (Last ${periodLabel})`);
      console.log("-".repeat(40));
      topByIncome.forEach((country, index) => {
        console.log(
          `${(index + 1).toString().padStart(2)}. ${country.countryName.padEnd(20)} ${country.totalIncome.toFixed(2)}`
        );
      });
      console.log();
    }

    // Top 10 by spending
    const topBySpending = [...countryResults]
      .filter((c) => c.totalSpending > 0)
      .sort((a, b) => b.totalSpending - a.totalSpending)
      .slice(0, 10);

    if (topBySpending.length > 0) {
      console.log(`🛒 Top 10 Countries by Spending (Last ${periodLabel})`);
      console.log("-".repeat(40));
      topBySpending.forEach((country, index) => {
        console.log(
          `${(index + 1).toString().padStart(2)}. ${country.countryName.padEnd(20)} ${country.totalSpending.toFixed(2)}`
        );
      });
      console.log();
    }

    // Top 10 by transaction count
    const topByCount = [...countryResults]
      .filter((c) => c.transactionCount > 0)
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 10);

    if (topByCount.length > 0) {
      console.log(`📈 Top 10 Countries by Transaction Count (Last ${periodLabel})`);
      console.log("-".repeat(40));
      topByCount.forEach((country, index) => {
        console.log(
          `${(index + 1).toString().padStart(2)}. ${country.countryName.padEnd(20)} ${country.transactionCount} transactions`
        );
      });
      console.log();
    }

    console.log("✅ Scraping complete!");

  } catch (error) {
    console.error("❌ Error during scraping:", error);
    process.exit(1);
  }
}

// Run the scraper
main().catch(console.error);
