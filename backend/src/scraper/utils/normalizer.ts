// Data normalizer utility — cleans and standardizes scraped scholarship data

import { ScrapedScholarship } from "../types";

const VALID_EDUCATION_LEVELS = [
    "Under 10th", "10th", "12th", "Diploma",
    "Undergraduate", "Postgraduate", "PhD"
];

const VALID_CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

/**
 * Normalize a single scholarship record
 */
export function normalizeScholarship(raw: Partial<ScrapedScholarship>, source: string): ScrapedScholarship {
    return {
        name: cleanText(raw.name || "Unknown Scholarship"),
        provider: cleanText(raw.provider || "Unknown Provider"),
        description: cleanText(raw.description || ""),
        eligibility_criteria: cleanText(raw.eligibility_criteria || ""),
        education_level: normalizeEducationLevels(raw.education_level || []),
        category: normalizeCategories(raw.category || ["General"]),
        income_limit: normalizeNumber(raw.income_limit),
        marks_requirement: normalizeNumber(raw.marks_requirement),
        state: normalizeState(raw.state || "All India"),
        gender: raw.gender || "All",
        benefits: cleanText(raw.benefits || ""),
        deadline: normalizeDeadline(raw.deadline),
        required_documents: normalizeDocuments(raw.required_documents || []),
        official_website: cleanUrl(raw.official_website || ""),
        application_link: cleanUrl(raw.application_link || raw.official_website || ""),
        minority_status: raw.minority_status || false,
        disability_status: raw.disability_status || false,
        source: source,
        last_scraped: new Date().toISOString(),
    };
}

/**
 * Clean text: trim, collapse whitespace, remove hidden unicode
 */
function cleanText(text: string): string {
    if (!text) return "";
    return text
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Normalize education levels to our standard set
 */
function normalizeEducationLevels(levels: string[]): string[] {
    if (!levels || levels.length === 0) return ["Undergraduate"];

    const mapped: string[] = [];
    for (const level of levels) {
        const l = level.toLowerCase().trim();

        if (l.includes("phd") || l.includes("doctoral") || l.includes("ph.d")) {
            mapped.push("PhD");
        } else if (l.includes("postgraduate") || l.includes("post-graduate") || l.includes("pg") || l.includes("masters") || l.includes("m.phil")) {
            mapped.push("Postgraduate");
        } else if (l.includes("undergraduate") || l.includes("graduation") || l.includes("ug") || l.includes("degree") || l.includes("b.tech") || l.includes("b.e") || l.includes("b.sc") || l.includes("b.a") || l.includes("b.com")) {
            mapped.push("Undergraduate");
        } else if (l.includes("diploma") || l.includes("iti") || l.includes("polytechnic")) {
            mapped.push("Diploma");
        } else if (l.includes("12") || l.includes("intermediate") || l.includes("plus two") || l.includes("+2") || l.includes("hsc")) {
            mapped.push("12th");
        } else if (l.includes("10") || l.includes("ssc") || l.includes("matric") || l.includes("secondary")) {
            mapped.push("10th");
        } else if (l.includes("class 1") || l.includes("class 2") || l.includes("class 3") || l.includes("class 4") || l.includes("class 5") || l.includes("class 6") || l.includes("class 7") || l.includes("class 8") || l.includes("primary") || l.includes("under 10")) {
            mapped.push("Under 10th");
        } else {
            // Try to find the closest match
            const closest = VALID_EDUCATION_LEVELS.find(v => v.toLowerCase().includes(l));
            if (closest) mapped.push(closest);
        }
    }

    // Deduplicate
    return [...new Set(mapped.length > 0 ? mapped : ["Undergraduate"])];
}

/**
 * Normalize categories to standard set
 */
function normalizeCategories(cats: string[]): string[] {
    if (!cats || cats.length === 0) return ["General"];

    const mapped: string[] = [];
    for (const cat of cats) {
        const c = cat.toUpperCase().trim();
        if (c.includes("SC") && !c.includes("SBC")) mapped.push("SC");
        if (c.includes("ST")) mapped.push("ST");
        if (c.includes("OBC") || c.includes("BC") || c.includes("BACKWARD")) mapped.push("OBC");
        if (c.includes("EWS") || c.includes("EBC") || c.includes("ECONOMICALLY")) mapped.push("EWS");
        if (c.includes("GENERAL") || c.includes("ALL") || c.includes("OPEN") || c.includes("UR")) mapped.push("General");
    }

    return [...new Set(mapped.length > 0 ? mapped : ["General"])];
}

/**
 * Parse income amounts from text
 */
function normalizeNumber(val: any): number {
    if (typeof val === "number") return val;
    if (!val) return 0;

    const str = String(val)
        .replace(/[₹,\s]/g, "")
        .replace(/lakhs?|lacs?/gi, "00000")
        .replace(/crores?/gi, "0000000");

    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.floor(num);
}

/**
 * Normalize state names
 */
function normalizeState(state: string): string {
    if (!state) return "All India";

    const s = state.trim();

    // Map common abbreviations
    const stateMap: Record<string, string> = {
        "AP": "Andhra Pradesh",
        "TS": "Telangana",
        "TN": "Tamil Nadu",
        "KA": "Karnataka",
        "MH": "Maharashtra",
        "MP": "Madhya Pradesh",
        "UP": "Uttar Pradesh",
        "WB": "West Bengal",
        "DL": "Delhi",
        "RJ": "Rajasthan",
        "GJ": "Gujarat",
        "BR": "Bihar",
        "OR": "Odisha",
        "HR": "Haryana",
        "PB": "Punjab",
        "JK": "Jammu and Kashmir",
        "HP": "Himachal Pradesh",
        "UK": "Uttarakhand",
        "AS": "Assam",
        "KL": "Kerala",
        "GA": "Goa",
    };

    if (stateMap[s.toUpperCase()]) return stateMap[s.toUpperCase()];
    if (s.toLowerCase().includes("all") || s.toLowerCase().includes("india") || s.toLowerCase().includes("national")) return "All India";

    return s;
}

/**
 * Normalize deadline string to ISO format
 */
function normalizeDeadline(deadline: any): string {
    if (!deadline) {
        // Default to 6 months from now
        const d = new Date();
        d.setMonth(d.getMonth() + 6);
        return d.toISOString();
    }

    if (typeof deadline === "string") {
        // Try direct ISO parse
        const parsed = new Date(deadline);
        if (!isNaN(parsed.getTime())) return parsed.toISOString();

        // Try DD/MM/YYYY or DD-MM-YYYY
        const ddmmyyyy = deadline.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (ddmmyyyy) {
            const d = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`);
            if (!isNaN(d.getTime())) return d.toISOString();
        }

        // Try month name patterns (e.g. "15 November 2026")
        const monthName = deadline.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{4})/i);
        if (monthName) {
            const d = new Date(`${monthName[2]} ${monthName[1]}, ${monthName[3]}`);
            if (!isNaN(d.getTime())) return d.toISOString();
        }
    }

    // Fallback: 6 months from now
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString();
}

/**
 * Normalize document names
 */
function normalizeDocuments(docs: string[]): string[] {
    if (!docs || docs.length === 0) {
        return ["Aadhaar Card", "Marksheet", "Income Certificate"];
    }
    return docs.map(d => cleanText(d)).filter(d => d.length > 0);
}

/**
 * Clean and validate URLs
 */
function cleanUrl(url: string): string {
    if (!url) return "";
    let cleaned = url.trim();
    if (cleaned && !cleaned.startsWith("http")) {
        cleaned = "https://" + cleaned;
    }
    return cleaned;
}

/**
 * Parse income limit from text like "₹2.5 Lakhs" or "250000"
 */
export function parseIncomeFromText(text: string): number {
    if (!text) return 0;

    const lakhMatch = text.match(/([\d.]+)\s*lakhs?/i);
    if (lakhMatch) return Math.floor(parseFloat(lakhMatch[1]) * 100000);

    const croreMatch = text.match(/([\d.]+)\s*crores?/i);
    if (croreMatch) return Math.floor(parseFloat(croreMatch[1]) * 10000000);

    const num = text.replace(/[₹,\s]/g, "");
    const parsed = parseFloat(num);
    return isNaN(parsed) ? 0 : Math.floor(parsed);
}

/**
 * Extract marks/percentage from text
 */
export function parseMarksFromText(text: string): number {
    if (!text) return 0;

    const match = text.match(/(\d{1,3})\s*%/);
    if (match) return parseInt(match[1]);

    const cgpaMatch = text.match(/(\d+\.?\d*)\s*(cgpa|gpa)/i);
    if (cgpaMatch) return Math.floor(parseFloat(cgpaMatch[1]) * 10); // 8.0 CGPA -> ~80%

    return 0;
}
