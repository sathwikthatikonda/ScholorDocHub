// Shared types for the scraper system

export interface ScrapedScholarship {
    name: string;
    provider: string;
    description: string;
    eligibility_criteria: string;
    education_level: string[];
    category: string[];
    income_limit: number;
    marks_requirement: number;
    state: string;
    gender: string;
    benefits: string;
    deadline: string;
    required_documents: string[];
    official_website: string;
    application_link: string;
    minority_status: boolean;
    disability_status: boolean;
    source: string; // Which scraper produced this
    last_scraped: string; // ISO timestamp
}

export interface ScraperResult {
    source: string;
    scholarships: ScrapedScholarship[];
    errors: string[];
    duration_ms: number;
}

export interface ScraperSource {
    name: string;
    scrape(): Promise<ScraperResult>;
}
