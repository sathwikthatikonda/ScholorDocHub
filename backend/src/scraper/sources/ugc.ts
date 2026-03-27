// UGC Scholarships scraper

import { ScrapedScholarship, ScraperResult } from "../types";
import { normalizeScholarship } from "../utils/normalizer";
import { logger } from "../utils/logger";

const SOURCE = "UGC";

const UGC_SCHOLARSHIPS: Partial<ScrapedScholarship>[] = [
    {
        name: "PG Indira Gandhi Scholarship for Single Girl Child",
        provider: "University Grants Commission (UGC)",
        description: "To support girl students who are the single child in their family to pursue postgraduate education.",
        eligibility_criteria: "Girl students who are the only child in their family and have taken admission in regular full-time PG first-year course.",
        education_level: ["Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 0,
        marks_requirement: 0,
        state: "All India",
        gender: "Female",
        benefits: "₹36,200 per annum for two years.",
        deadline: "2026-10-31",
        required_documents: ["Single Girl Child Affidavit", "Admission Proof", "Aadhaar Card", "Photograph"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://scholarships.gov.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "PG Scholarship for University Rank Holders",
        provider: "University Grants Commission (UGC)",
        description: "To promote excellence in post-graduate studies and attract meritorious students to pursue postgraduate education.",
        eligibility_criteria: "1st or 2nd rank holders in undergraduate courses from recognized universities who have taken admission in any PG course.",
        education_level: ["Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 0,
        marks_requirement: 80,
        state: "All India",
        gender: "All",
        benefits: "₹3,100 per month for two years.",
        deadline: "2026-11-15",
        required_documents: ["UG Rank Certificate", "Degree Certificate", "Admission Receipt", "Aadhaar Card"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://scholarships.gov.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "Ishan Uday Scholarship for North-Eastern Region",
        provider: "University Grants Commission (UGC)",
        description: "Promoting higher education in the North Eastern Region of India.",
        eligibility_criteria: "Domicile of North Eastern states. Pursuing general UG courses. Minimum 60% marks in 12th.",
        education_level: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 450000,
        marks_requirement: 60,
        state: "All India",
        gender: "All",
        benefits: "₹5,400 per month for general UG courses. ₹7,800/month for technical courses.",
        deadline: "2026-10-31",
        required_documents: ["Domicile Certificate of NE State", "12th Marksheet", "Income Certificate", "Aadhaar"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://scholarships.gov.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "NET JRF Fellowship",
        provider: "University Grants Commission (UGC)",
        description: "Junior Research Fellowship awarded to candidates who qualify the National Eligibility Test for pursuing PhD.",
        eligibility_criteria: "Candidates qualified NET-JRF. Must register for PhD within 2 years.",
        education_level: ["PhD"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 0,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹31,000/month for first 2 years (JRF). ₹35,000/month for next 3 years (SRF). Contingency grant ₹10,000-₹20,500/year.",
        deadline: "2026-12-31",
        required_documents: ["NET Score Card", "PhD Registration Proof", "Degree Certificate", "Aadhaar Card"],
        official_website: "https://ugcnet.nta.ac.in/",
        application_link: "https://ugcnet.nta.ac.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "Rajiv Gandhi National Fellowship for SC Candidates",
        provider: "University Grants Commission (UGC)",
        description: "Fellowship for SC candidates to pursue M.Phil/PhD in Sciences, Humanities, Social Sciences, and Engineering.",
        eligibility_criteria: "SC candidates registered for M.Phil/PhD in universities/institutions/colleges recognized by UGC.",
        education_level: ["PhD"],
        category: ["SC"],
        income_limit: 0,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹31,000/month (JRF, 2 years). ₹35,000/month (SRF, 3 years). Contingency and HRA as per norms.",
        deadline: "2026-12-31",
        required_documents: ["SC Certificate", "PhD Registration Proof", "PG Degree Certificate"],
        official_website: "https://ugcnet.nta.ac.in/",
        application_link: "https://ugcnet.nta.ac.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "Maulana Azad National Fellowship for Minority Students",
        provider: "University Grants Commission (UGC)",
        description: "Fellowship for students belonging to minority communities to pursue M.Phil/PhD.",
        eligibility_criteria: "Minority community students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) who qualify NET for JRF or equivalent.",
        education_level: ["PhD"],
        category: ["General", "OBC"],
        income_limit: 600000,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹31,000/month (JRF). ₹35,000/month (SRF). HRA and Contingency as per UGC norms.",
        deadline: "2026-12-31",
        required_documents: ["Minority Certificate", "NET Score Card", "PhD Registration Proof", "Income Certificate"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://scholarships.gov.in/",
        minority_status: true,
        disability_status: false,
    },
];

export async function scrapeUGC(): Promise<ScraperResult> {
    const start = Date.now();
    const errors: string[] = [];
    const scholarships: ScrapedScholarship[] = [];

    try {
        logger.scraperStart(SOURCE);

        for (const raw of UGC_SCHOLARSHIPS) {
            try {
                scholarships.push(normalizeScholarship(raw, SOURCE));
            } catch (err) {
                const msg = `Failed to normalize: ${raw.name}`;
                errors.push(msg);
                logger.error(SOURCE, msg, err);
            }
        }
    } catch (err) {
        errors.push("UGC scraper failure");
        logger.error(SOURCE, "UGC scraper failure", err);
    }

    const duration = Date.now() - start;
    logger.scraperEnd(SOURCE, scholarships.length, duration);
    return { source: SOURCE, scholarships, errors, duration_ms: duration };
}
