import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Fallback hardcoded data (used if Supabase is unreachable) ────

const FALLBACK_SCHOLARSHIPS: any[] = [
    {
        _id: "sc-001", id: "sc-001",
        name: "Pre-Matric Scholarship Scheme for Minorities",
        provider: "Ministry of Minority Affairs, Govt of India",
        eligibilityCriteria: "Students belonging to minority communities studying in classes 1 to 10. Minimum 50% marks.",
        educationLevel: ["10th", "Under 10th"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 100000, marksRequirement: 50, state: "All India",
        description: "Encourages parents from minority communities to send their school going children to school.",
        benefits: "Admission fee, Tuition fee, and Maintenance allowance (₹1,000 to ₹6,000 per annum).",
        deadline: "2026-11-15",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Community/Minority Certificate", "Previous Year Marksheet", "Bank Passbook"],
        officialWebsite: "https://scholarships.gov.in/", minorityStatus: true, disabilityStatus: false
    },
    {
        _id: "sc-002", id: "sc-002",
        name: "Post-Matric Scholarship Scheme for Minorities",
        provider: "Ministry of Minority Affairs, Govt of India",
        eligibilityCriteria: "Students from minority communities studying in Class 11, 12, UG, PG, M.Phil, Ph.D. Minimum 50% marks.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 200000, marksRequirement: 50, state: "All India",
        description: "Award scholarships to meritorious students belonging to economically weaker sections of minority community.",
        benefits: "Admission + Tuition fee up to ₹10,000 per annum. Maintenance allowance up to ₹10,000 per annum.",
        deadline: "2026-11-30",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Minority Declaration", "Previous Marksheet", "Fee Receipt", "Bank Passbook"],
        officialWebsite: "https://scholarships.gov.in/", minorityStatus: true, disabilityStatus: false
    },
];

// ── Map Supabase row to frontend-compatible format ───────────────

function mapToFrontend(row: any): any {
    // Helper to ensure array and handle nulls
    const ensureArray = (val: any) => {
        if (!val) return ["All"];
        if (Array.isArray(val)) return val.length > 0 ? val : ["All"];
        return [val];
    };

    return {
        _id: row.id,
        id: row.id,
        name: row.name,
        provider: row.provider,
        eligibilityCriteria: row.eligibility_criteria,
        educationLevel: ensureArray(row.education_level),
        category: ensureArray(row.category),
        incomeLimit: row.income_limit || 0,
        marksRequirement: row.marks_requirement || 0,
        state: row.state || "All India",
        gender: row.gender || "All",
        description: row.description,
        benefits: row.benefits,
        deadline: row.deadline,
        requiredDocuments: row.required_documents || [],
        officialWebsite: row.official_website,
        applicationLink: row.application_link || row.official_website,
        minorityStatus: !!row.minority_status,
        disabilityStatus: !!row.disability_status,
        source: row.source,
        lastScraped: row.last_scraped,
    };
}

// ── GET /api/scholarships ────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const educationLevel = searchParams.get('educationLevel');
        const category = searchParams.get('category');
        const state = searchParams.get('state');
        const incomeLimit = searchParams.get('incomeLimit');
        const marksPercentage = searchParams.get('marksPercentage');
        const gender = searchParams.get('gender');
        const minorityStatus = searchParams.get('minorityStatus');
        const disabilityStatus = searchParams.get('disabilityStatus');
        const ids = searchParams.get('ids');

        // If specific IDs requested (for saved/applied scholarships)
        if (ids) {
            const idList = ids.split(',').filter(Boolean);
            if (idList.length === 0) return NextResponse.json([]);

            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .in('id', idList);

            if (error) {
                console.error('Supabase fetch error (IDs):', error.message);
                // Fallback to hardcoded data filtered by IDs
                const fallback = FALLBACK_SCHOLARSHIPS.filter(s => idList.includes(s._id));
                return NextResponse.json(fallback);
            }

            return NextResponse.json((data || []).map(mapToFrontend));
        }

        let allData: any[] = [];
        let from = 0;
        const PAGE_LIMIT = 1000;
        let hasMore = true;
        let fetchError: any = null;

        while (hasMore) {
            const { data: chunk, error } = await supabase
                .from('scholarships')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, from + PAGE_LIMIT - 1);

            if (error) {
                fetchError = error;
                break;
            }

            if (chunk && chunk.length > 0) {
                allData = allData.concat(chunk);
                if (chunk.length < PAGE_LIMIT) {
                    hasMore = false;
                } else {
                    from += PAGE_LIMIT;
                }
            } else {
                hasMore = false;
            }
        }

        const data = allData;
        const error = fetchError;

        if (error) {
            console.error('Supabase fetch error:', error.message);
            // Fallback to hardcoded data
            return NextResponse.json(filterFallback(FALLBACK_SCHOLARSHIPS, { 
                educationLevel, category, state, incomeLimit, marksPercentage, 
                gender, minorityStatus, disabilityStatus 
            }));
        }

        let results = (data || []).map(mapToFrontend);

        const isAll = searchParams.get('all') === 'true';

        if (!isAll) {
            // Apply filters in JS for maximum compatibility
            if (educationLevel) {
                results = results.filter((s: any) =>
                    s.educationLevel?.includes(educationLevel) || s.educationLevel?.includes('All')
                );
            }
            if (category) {
                results = results.filter((s: any) =>
                    s.category?.includes(category) || s.category?.includes('All') || s.category?.includes('General')
                );
            }
            if (state) {
                results = results.filter((s: any) => s.state === state || s.state === 'All India');
            }
            if (incomeLimit) {
                const income = Number(incomeLimit);
                results = results.filter((s: any) => s.incomeLimit === 0 || s.incomeLimit >= income);
            }
            if (marksPercentage) {
                const marks = Number(marksPercentage);
                results = results.filter((s: any) => s.marksRequirement === 0 || s.marksRequirement <= marks);
            }
            if (gender && gender !== 'Other') {
                results = results.filter((s: any) => {
                    const sGender = s.gender || "All";
                    if (sGender === 'All') {
                        const name = s.name?.toLowerCase() || "";
                        if (name.includes("girl") || name.includes("female") || name.includes("women")) {
                            return gender === 'Female';
                        }
                        return true;
                    }
                    return sGender === gender;
                });
            }
            if (minorityStatus === 'false') {
                results = results.filter((s: any) => !s.minorityStatus);
            }
            if (disabilityStatus === 'false') {
                results = results.filter((s: any) => !s.disabilityStatus);
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Scholarships API error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// ── Fallback filter (used when Supabase is unreachable) ──────────

function filterFallback(data: any[], filters: any) {
    let filtered = [...data];

    if (filters.educationLevel) {
        filtered = filtered.filter(s =>
            s.educationLevel?.includes(filters.educationLevel) || s.educationLevel?.includes('All')
        );
    }
    if (filters.category) {
        filtered = filtered.filter(s =>
            s.category?.includes(filters.category) || s.category?.includes('All') || s.category?.includes('General')
        );
    }
    if (filters.state) {
        filtered = filtered.filter(s => s.state === filters.state || s.state === 'All India');
    }
    if (filters.incomeLimit) {
        const income = Number(filters.incomeLimit);
        filtered = filtered.filter(s => s.incomeLimit === 0 || s.incomeLimit >= income);
    }
    if (filters.marksPercentage) {
        const marks = Number(filters.marksPercentage);
        filtered = filtered.filter(s => s.marksRequirement === 0 || s.marksRequirement <= marks);
    }
    if (filters.gender && filters.gender !== 'Other') {
        filtered = filtered.filter(s => !s.gender || s.gender === 'All' || s.gender === filters.gender);
    }
    if (filters.minorityStatus === 'false') {
        filtered = filtered.filter(s => !s.minorityStatus);
    }
    if (filters.disabilityStatus === 'false') {
        filtered = filtered.filter(s => !s.disabilityStatus);
    }

    return filtered;
}
