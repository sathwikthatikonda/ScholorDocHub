// AICTE Scholarships scraper

import { ScrapedScholarship, ScraperResult } from "../types";
import { normalizeScholarship } from "../utils/normalizer";
import { logger } from "../utils/logger";

const SOURCE = "AICTE";

const AICTE_SCHOLARSHIPS: Partial<ScrapedScholarship>[] = [
    {
        name: "AICTE Pragati Scholarship for Girls",
        provider: "All India Council for Technical Education (AICTE)",
        description: "Scheme aiming at providing assistance for Advancement of Girls pursuing Technical Education.",
        eligibility_criteria: "Girl students admitted to first year of Degree/Diploma course in an AICTE approved institution. Maximum two girls per family.",
        education_level: ["Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 800000,
        marks_requirement: 0,
        state: "All India",
        gender: "Female",
        benefits: "₹50,000 per annum for every year of study for a maximum of 4 years for degree and 3 years for diploma.",
        deadline: "2026-11-30",
        required_documents: ["Aadhaar Card", "Income Certificate", "Admission Letter", "Previous Marksheet", "Directorate of Tech Ed Approval"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://www.aicte-india.org/bureaus/swanath/pragati",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "AICTE Saksham Scholarship Scheme for Specially Abled Student",
        provider: "All India Council for Technical Education (AICTE)",
        description: "Scheme intended to provide encouragement and support to specially abled children to pursue Technical Education.",
        eligibility_criteria: "Specially abled students having disability of not less than 40%. Admitted to first year of Degree/Diploma course in an AICTE approved institution.",
        education_level: ["Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 800000,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹50,000 per annum for every year of study.",
        deadline: "2026-11-30",
        required_documents: ["Disability Certificate", "Aadhaar Card", "Income Certificate", "Admission Proof"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://www.aicte-india.org/bureaus/swanath/saksham",
        minority_status: false,
        disability_status: true,
    },
    {
        name: "Swanath Scholarship Scheme (Technical Degree)",
        provider: "All India Council for Technical Education (AICTE)",
        description: "Support for students from vulnerable families to continue technical education.",
        eligibility_criteria: "Orphaned children / children whose either/both parents died due to Covid-19 pursuing a technical degree course in AICTE institutions.",
        education_level: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 800000,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹50,000 per annum for every year of study.",
        deadline: "2026-11-30",
        required_documents: ["Covid-19 Death Certificate of Parents (if applicable)", "Orphan Certificate", "Admission Proof"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://www.aicte-india.org/bureaus/swanath",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "Pragati Scholarship Scheme For Technical Education",
        provider: "Ministry of Education",
        description: "Empowering Girls through Technical Education under the Pragati Scheme.",
        eligibility_criteria: "Only for Girls pursuing Technical Education (Degree/Diploma) from AICTE approved Institutions.",
        education_level: ["Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 800000,
        marks_requirement: 0,
        state: "All India",
        gender: "Female",
        benefits: "₹50,000/annum for every year of study.",
        deadline: "2026-10-31",
        required_documents: ["Aadhaar Card", "Income Certificate", "Admission Letter", "Previous Marksheet", "Directorate of Tech Ed Approval"],
        official_website: "https://scholarships.gov.in/",
        application_link: "https://scholarships.gov.in/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "AICTE PG Scholarship for GATE/GPAT Qualified Students",
        provider: "All India Council for Technical Education (AICTE)",
        description: "Scholarship for GATE/GPAT qualified PG students in AICTE approved institutions.",
        eligibility_criteria: "Students admitted to M.E./M.Tech/M.Pharm courses on the basis of GATE/GPAT score.",
        education_level: ["Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 0,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹12,400 per month for the full duration of the course (up to 24 months).",
        deadline: "2026-12-31",
        required_documents: ["GATE/GPAT Score Card", "Admission Letter", "Aadhaar Card", "Bank Details"],
        official_website: "https://www.aicte-india.org/",
        application_link: "https://www.aicte-india.org/",
        minority_status: false,
        disability_status: false,
    },
    {
        name: "AICTE Doctoral Fellowship",
        provider: "All India Council for Technical Education (AICTE)",
        description: "Fellowship for PhD scholars in AICTE approved institutions to encourage research.",
        eligibility_criteria: "Full-time PhD scholars registered in AICTE approved institutions in Engineering/Technology/Architecture/Management/Pharmacy.",
        education_level: ["PhD"],
        category: ["General", "OBC", "SC", "ST"],
        income_limit: 0,
        marks_requirement: 0,
        state: "All India",
        gender: "All",
        benefits: "₹25,000/month for 3 years. Contingency grant ₹20,000/year.",
        deadline: "2026-12-31",
        required_documents: ["PhD Registration Proof", "PG Degree Certificate", "Aadhaar Card"],
        official_website: "https://www.aicte-india.org/",
        application_link: "https://www.aicte-india.org/",
        minority_status: false,
        disability_status: false,
    },
];

export async function scrapeAICTE(): Promise<ScraperResult> {
    const start = Date.now();
    const errors: string[] = [];
    const scholarships: ScrapedScholarship[] = [];

    try {
        logger.scraperStart(SOURCE);

        for (const raw of AICTE_SCHOLARSHIPS) {
            try {
                scholarships.push(normalizeScholarship(raw, SOURCE));
            } catch (err) {
                const msg = `Failed to normalize: ${raw.name}`;
                errors.push(msg);
                logger.error(SOURCE, msg, err);
            }
        }
    } catch (err) {
        errors.push("AICTE scraper failure");
        logger.error(SOURCE, "AICTE scraper failure", err);
    }

    const duration = Date.now() - start;
    logger.scraperEnd(SOURCE, scholarships.length, duration);
    return { source: SOURCE, scholarships, errors, duration_ms: duration };
}
