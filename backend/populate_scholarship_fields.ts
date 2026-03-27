import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// ─── Education Level Inference ───────────────────────────────────────────────
function inferEducationLevel(name: string, desc: string, eligibility: string): string[] {
    const text = `${name} ${desc} ${eligibility}`.toLowerCase();

    const levels: string[] = [];

    const hasPhD = /\bphd\b|doctoral|doctorate|research scholar|m\.phil/i.test(text);
    const hasMasters = /\bm\.?tech\b|\bm\.?e\b|\bmba\b|\bm\.?sc\b|\bm\.?a\b|\bm\.?com\b|\bpg\b|post.?graduate|master'?s?|postgraduate/i.test(text);
    const hasDegree = /\bb\.?tech\b|\bb\.?e\b|\bba\b|\bb\.?sc\b|\bb\.?com\b|\bunder.?graduate|degree|graduation|ug\b|bachelor/i.test(text);
    const hasDiploma = /\bdiploma\b|\bpoly.?technic\b|\bpoly\b/i.test(text);
    const has12th = /\b12th\b|\bclass 12\b|\bintermediate\b|\bhsc\b|\bhigher secondary\b|\bsecond.?year.*college\b|\bfirst.?year.*college\b|\bplus two\b|\b\+2\b/i.test(text);
    const has10th = /\b10th\b|\bclass 10\b|\bssc\b|\bmatric\b|\bsecondary\b/i.test(text);
    const hasSchool = /\bschool\b|\bprimary\b|\belementary\b/i.test(text);

    // "all levels" indicators
    const allLevels = /all (levels?|courses?|streams?|students?)|any (course|level|stream|grade)/i.test(text);
    if (allLevels && !hasPhD && !hasMasters && !hasDegree && !hasDiploma && !has12th && !has10th) {
        return ["10th", "12th", "Diploma", "Undergraduate", "Postgraduate"];
    }

    if (hasPhD) levels.push("Postgraduate");
    if (hasMasters) levels.push("Postgraduate");
    if (hasDegree) levels.push("Undergraduate");
    if (hasDiploma) levels.push("Diploma");
    if (has12th) levels.push("12th");
    if (has10th) levels.push("10th");

    // If nothing matched conclusively, try to infer from level phrases
    if (levels.length === 0) {
        // Generic "higher education" = UG + PG
        if (/higher education|further education|college student/i.test(text)) {
            levels.push("Undergraduate", "Postgraduate");
        } else if (/professional course|technical education|engineering|medical|law|architecture/i.test(text)) {
            levels.push("Undergraduate", "Postgraduate");
        } else {
            // Default: covers all common levels
            levels.push("12th", "Undergraduate", "Postgraduate");
        }
    }

    // De-duplicate
    return [...new Set(levels)];
}

// ─── Category Inference ───────────────────────────────────────────────────────
function inferCategory(name: string, desc: string, eligibility: string): string[] {
    const text = `${name} ${desc} ${eligibility}`.toLowerCase();

    const categories: string[] = [];

    if (/\bsc\b|scheduled caste|dalit/i.test(text)) categories.push("SC");
    if (/\bst\b|scheduled tribe|tribal|adivasi/i.test(text)) categories.push("ST");
    if (/\bobc\b|other backward class|backward class/i.test(text)) categories.push("OBC");
    if (/\bminority\b|muslim|christian|sikh|jain|buddhist|parsi/i.test(text)) categories.push("Minority");
    if (/\bpwd\b|disable|handicap|differently abled|person with disability/i.test(text)) categories.push("PwD");
    if (/\bgirl|female|woman|women/i.test(text)) categories.push("General", "SC", "ST", "OBC");
    if (/economically weaker|ews\b|below poverty|bpl\b|low.?income|poor family|meritorious.*needy|need.?based/i.test(text)) {
        if (categories.length === 0) categories.push("General", "OBC", "SC", "ST");
    }

    // If nothing matched, it might be general or merit-based
    if (categories.length === 0) {
        if (/merit|academic|talent|topper|bright|excellence/i.test(text)) {
            categories.push("General", "OBC", "SC", "ST");
        } else {
            categories.push("General", "OBC", "SC", "ST");
        }
    }

    return [...new Set(categories)];
}

// ─── Required Documents Inference ────────────────────────────────────────────
function inferRequiredDocuments(name: string, desc: string, eligibility: string, category: string[]): string[] {
    const text = `${name} ${desc} ${eligibility}`.toLowerCase();
    const docs: string[] = [];

    // Always required
    docs.push("Aadhaar Card");
    docs.push("Passport Size Photographs");
    docs.push("Bank Passbook / Account Details");

    // Income-based docs
    if (/income|economically|financial|bpl|ews|poverty|salary/i.test(text)) {
        docs.push("Income Certificate");
    }

    // Marks-based docs
    if (/mark|percent|cgpa|score|academic|merit|exam/i.test(text)) {
        docs.push("Latest Marksheet / Transcripts");
    }

    // Category-based docs
    if (category.includes("SC")) docs.push("Caste Certificate (SC)");
    if (category.includes("ST")) docs.push("Caste Certificate (ST)");
    if (category.includes("OBC")) docs.push("OBC Non-Creamy Layer Certificate");
    if (category.includes("Minority")) docs.push("Minority Community Certificate");
    if (category.includes("PwD")) docs.push("Disability Certificate (PwD)");

    // Education-related docs
    docs.push("Previous Year Marksheet");

    // Domicile docs
    if (/state|domicile|resident|local|permanent/i.test(text)) {
        docs.push("Domicile / Residence Certificate");
    }

    // Fee receipt
    if (/tuiti?on|fee|admission|college|university|institution/i.test(text)) {
        docs.push("College / Institution Admission Proof");
        docs.push("Fee Receipt");
    }

    // Transfer certificate
    if (/school|12th|10th|secondary/i.test(text)) {
        docs.push("Transfer Certificate (TC)");
    }

    // EWS
    if (/ews\b|economically weaker section/i.test(text)) {
        docs.push("EWS Certificate");
    }

    // Parental death
    if (/orphan|widow|single parent|father.*death|parent.*death|deceased/i.test(text)) {
        docs.push("Death Certificate of Parent (if applicable)");
    }

    return [...new Set(docs)];
}

// ─── Main Script ──────────────────────────────────────────────────────────────
async function main() {
    console.log("📥 Fetching all scholarships from database...");

    let allScholarships: any[] = [];
    let from = 0;
    const PAGE_LIMIT = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data: chunk, error } = await supabase
            .from('scholarships')
            .select('id, name, description, eligibility_criteria, education_level, category, required_documents')
            .range(from, from + PAGE_LIMIT - 1);

        if (error) {
            console.error("❌ Failed to fetch scholarships:", error.message);
            process.exit(1);
        }

        if (chunk && chunk.length > 0) {
            allScholarships = allScholarships.concat(chunk);
            if (chunk.length < PAGE_LIMIT) {
                hasMore = false;
            } else {
                from += PAGE_LIMIT;
            }
        } else {
            hasMore = false;
        }
    }

    const scholarships = allScholarships;

    console.log(`✅ Found ${scholarships.length} scholarships. Processing...`);

    let updated = 0;
    let skipped = 0;
    const batchSize = 20;

    for (let i = 0; i < scholarships.length; i += batchSize) {
        const batch = scholarships.slice(i, i + batchSize);
        const updates: Promise<any>[] = [];

        for (const sch of batch) {
            const name = sch.name || '';
            const desc = sch.description || '';
            const eligibility = sch.eligibility_criteria || '';

            const educationLevel = inferEducationLevel(name, desc, eligibility);
            const category = inferCategory(name, desc, eligibility);
            const requiredDocuments = inferRequiredDocuments(name, desc, eligibility, category);

            const updatePayload: any = {};

            // Only update fields that are null/empty
            if (!sch.education_level || (Array.isArray(sch.education_level) && sch.education_level.length === 0)) {
                updatePayload.education_level = educationLevel;
            }
            if (!sch.category || (Array.isArray(sch.category) && sch.category.length === 0)) {
                updatePayload.category = category;
            }
            if (!sch.required_documents || (Array.isArray(sch.required_documents) && sch.required_documents.length === 0)) {
                updatePayload.required_documents = requiredDocuments;
            }

            if (Object.keys(updatePayload).length === 0) {
                skipped++;
                continue;
            }

            updates.push(
                supabase
                    .from('scholarships')
                    .update(updatePayload)
                    .eq('id', sch.id)
                    .then(({ error }: { error: any }) => {
                        if (error) {
                            console.error(`❌ Error updating ${sch.name}:`, error.message);
                        } else {
                            updated++;
                        }
                    }) as Promise<any>
            );
        }

        await Promise.all(updates);
        console.log(`  → Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(scholarships.length / batchSize)} complete`);
    }

    console.log(`\n🎉 Done! Updated: ${updated}, Skipped (already set): ${skipped}`);

    // ── Verification ──────────────────────────────────────────────────────────
    const { data: sample } = await supabase
        .from('scholarships')
        .select('name, education_level, category, required_documents')
        .limit(3);

    console.log("\n📋 Sample after update:");
    sample?.forEach(s => {
        console.log(`  Name: ${s.name}`);
        console.log(`  Education: ${JSON.stringify(s.education_level)}`);
        console.log(`  Category: ${JSON.stringify(s.category)}`);
        console.log(`  Docs: ${JSON.stringify(s.required_documents)}`);
        console.log("  ---");
    });
}

main().catch(console.error);
