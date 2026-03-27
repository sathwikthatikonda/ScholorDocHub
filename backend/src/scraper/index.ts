// Scraper Engine — Main orchestrator with cron scheduler
// Coordinates all scrapers, deduplicates, and upserts into Supabase

import { createClient } from "@supabase/supabase-js";
import cron from "node-cron";
import dotenv from "dotenv";

import { ScrapedScholarship, ScraperResult } from "./types";
import { logger } from "./utils/logger";
import { scrapeNSP } from "./sources/nsp";
import { scrapeUGC } from "./sources/ugc";
import { scrapeAICTE } from "./sources/aicte";
import { scrapeStates } from "./sources/states";
import { scrapePrivate } from "./sources/private";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    logger.error("SCRAPER", "SUPABASE_URL or SUPABASE_KEY missing in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Log warning if only Anon Key is available
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.warn("SCRAPER", "Using SUPABASE_ANON_KEY. If you hit RLS errors, please provide SUPABASE_SERVICE_ROLE_KEY in .env or disable RLS for 'scholarships' table.");
}

// ── Run All Scrapers ─────────────────────────────────────────────

async function runAllScrapers(): Promise<ScraperResult[]> {
    const results: ScraperResult[] = [];

    const scrapers = [
        { name: "NSP", fn: scrapeNSP },
        { name: "UGC", fn: scrapeUGC },
        { name: "AICTE", fn: scrapeAICTE },
        { name: "State Portals", fn: scrapeStates },
        { name: "Private Foundations", fn: scrapePrivate },
    ];

    for (const scraper of scrapers) {
        try {
            const result = await scraper.fn();
            results.push(result);
        } catch (err) {
            logger.error("SCRAPER", `${scraper.name} scraper crashed — skipping`, err);
            results.push({
                source: scraper.name,
                scholarships: [],
                errors: [`Scraper crashed: ${err}`],
                duration_ms: 0,
            });
        }
    }

    return results;
}

// ── Deduplicate Scholarships ─────────────────────────────────────

function deduplicateScholarships(allScholarships: ScrapedScholarship[]): ScrapedScholarship[] {
    const seen = new Map<string, ScrapedScholarship>();

    for (const sch of allScholarships) {
        // Composite key: name + provider (lowercase, trimmed)
        const key = `${sch.name.toLowerCase().trim()}::${sch.provider.toLowerCase().trim()}`;

        if (!seen.has(key)) {
            seen.set(key, sch);
        } else {
            // Keep the one with more complete data
            const existing = seen.get(key)!;
            if (sch.description.length > existing.description.length) {
                seen.set(key, sch);
            }
        }
    }

    return Array.from(seen.values());
}

// ── Upsert into Supabase ─────────────────────────────────────────

async function upsertToSupabase(scholarships: ScrapedScholarship[]): Promise<{ inserted: number; updated: number; errors: number }> {
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const sch of scholarships) {
        try {
            // Check if scholarship already exists by name + provider
            const { data: existing, error: fetchError } = await supabase
                .from("scholarships")
                .select("id")
                .eq("name", sch.name)
                .eq("provider", sch.provider)
                .maybeSingle();

            if (fetchError) {
                if (fetchError.message.includes("row-level security")) {
                    logger.error("SUPABASE", `RLS Violation: Cannot fetch "${sch.name}". Use service_role key.`);
                } else {
                    logger.error("SUPABASE", `Fetch error for "${sch.name}": ${fetchError.message}`);
                }
                errors++;
                continue;
            }

            const record = {
                name: sch.name,
                provider: sch.provider,
                description: sch.description,
                eligibility_criteria: sch.eligibility_criteria,
                education_level: sch.education_level,
                category: sch.category,
                income_limit: sch.income_limit,
                marks_requirement: sch.marks_requirement,
                state: sch.state,
                benefits: sch.benefits,
                deadline: sch.deadline,
                required_documents: sch.required_documents,
                official_website: sch.application_link || sch.official_website,
                minority_status: sch.minority_status,
                disability_status: sch.disability_status,
                gender: sch.gender || "All",
            };

            if (existing) {
                // Update existing record
                const { error: updateError } = await supabase
                    .from("scholarships")
                    .update(record)
                    .eq("id", existing.id);

                if (updateError) {
                    if (updateError.message.includes("row-level security")) {
                        logger.error("SUPABASE", `RLS Violation: Cannot update "${sch.name}". Use service_role key.`);
                    } else {
                        logger.error("SUPABASE", `Update error for "${sch.name}": ${updateError.message}`);
                    }
                    errors++;
                } else {
                    updated++;
                }
            } else {
                // Insert new record
                const { error: insertError } = await supabase
                    .from("scholarships")
                    .insert(record);

                if (insertError) {
                    if (insertError.message.includes("row-level security")) {
                        logger.error("SUPABASE", `RLS Violation: Cannot insert "${sch.name}". Use service_role key.`);
                    } else {
                        logger.error("SUPABASE", `Insert error for "${sch.name}": ${insertError.message}`);
                    }
                    errors++;
                } else {
                    inserted++;
                }
            }
        } catch (err) {
            logger.error("SUPABASE", `Exception for "${sch.name}"`, err);
            errors++;
        }
    }

    return { inserted, updated, errors };
}

// ── Full Scraping Pipeline ───────────────────────────────────────

export async function runScrapingPipeline(): Promise<{
    totalScraped: number;
    totalUnique: number;
    inserted: number;
    updated: number;
    errors: number;
    durationMs: number;
    sourceBreakdown: { source: string; count: number; errors: string[] }[];
}> {
    const pipelineStart = Date.now();

    logger.info("PIPELINE", "═══════════════════════════════════════════════");
    logger.info("PIPELINE", "  ScholarDoc Hub — Scholarship Scraping Pipeline");
    logger.info("PIPELINE", "═══════════════════════════════════════════════");
    logger.info("PIPELINE", `Started at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);

    // Step 1: Run all scrapers
    logger.info("PIPELINE", "Step 1/3: Running scrapers from all sources...");
    const results = await runAllScrapers();

    const allScholarships: ScrapedScholarship[] = [];
    const sourceBreakdown: { source: string; count: number; errors: string[] }[] = [];

    for (const result of results) {
        allScholarships.push(...result.scholarships);
        sourceBreakdown.push({
            source: result.source,
            count: result.scholarships.length,
            errors: result.errors,
        });
    }

    const totalScraped = allScholarships.length;
    logger.info("PIPELINE", `Step 1 complete: Scraped ${totalScraped} scholarships from ${results.length} sources`);

    // Step 2: Deduplicate
    logger.info("PIPELINE", "Step 2/3: Deduplicating scholarships...");
    const unique = deduplicateScholarships(allScholarships);
    const totalUnique = unique.length;
    logger.info("PIPELINE", `Step 2 complete: ${totalUnique} unique scholarships (removed ${totalScraped - totalUnique} duplicates)`);

    // Step 3: Upsert to Supabase
    logger.info("PIPELINE", "Step 3/3: Upserting to Supabase...");
    const { inserted, updated, errors } = await upsertToSupabase(unique);

    const durationMs = Date.now() - pipelineStart;

    logger.info("PIPELINE", "═══════════════════════════════════════════════");
    logger.success("PIPELINE", `Pipeline complete in ${(durationMs / 1000).toFixed(1)}s`);
    logger.info("PIPELINE", `  📥 Scraped: ${totalScraped} total, ${totalUnique} unique`);
    logger.info("PIPELINE", `  ✅ Inserted: ${inserted} new scholarships`);
    logger.info("PIPELINE", `  🔄 Updated: ${updated} existing scholarships`);
    if (errors > 0) logger.warn("PIPELINE", `  ❌ Errors: ${errors}`);
    logger.info("PIPELINE", "═══════════════════════════════════════════════");

    return { totalScraped, totalUnique, inserted, updated, errors, durationMs, sourceBreakdown };
}

// ── Scheduler ────────────────────────────────────────────────────

let schedulerRunning = false;

export function startScheduler() {
    if (schedulerRunning) {
        logger.warn("SCHEDULER", "Scheduler already running — skipping duplicate start");
        return;
    }

    schedulerRunning = true;

    // Run daily at 2:00 AM IST (20:30 UTC previous day)
    cron.schedule("30 20 * * *", async () => {
        logger.info("SCHEDULER", "⏰ Scheduled daily scrape triggered");
        try {
            await runScrapingPipeline();
        } catch (err) {
            logger.error("SCHEDULER", "Scheduled scrape failed", err);
        }
    }, {
        timezone: "Asia/Kolkata"
    });

    logger.info("SCHEDULER", "📅 Daily scholarship scraper scheduled — runs at 2:00 AM IST");
}

// ── CLI Entry Point ──────────────────────────────────────────────

if (require.main === module) {
    (async () => {
        logger.info("CLI", "Running scraper manually via CLI...");
        try {
            const result = await runScrapingPipeline();
            console.log("\n📊 Result Summary:", JSON.stringify(result, null, 2));
        } catch (err) {
            logger.error("CLI", "Pipeline failed", err);
        }
        process.exit(0);
    })();
}
