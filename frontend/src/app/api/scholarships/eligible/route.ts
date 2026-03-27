import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

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

// POST /api/scholarships/eligible
// Body: { educationLevel, category, income, state, marksPercentage, gender, minorityStatus, disabilityStatus }
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            educationLevel,
            category,
            income,
            state,
            marksPercentage,
            gender,
            minorityStatus,
            disabilityStatus,
        } = body;

        let allData: any[] = [];
        let from = 0;
        const PAGE_LIMIT = 1000;
        let hasMore = true;
        let fetchError: any = null;

        while (hasMore) {
            const { data: chunk, error } = await supabase
                .from('scholarships')
                .select('*')
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
            console.error('Supabase error:', error.message);
            return NextResponse.json({ message: 'Database error' }, { status: 500 });
        }

        let results = (data || []).map(mapToFrontend);

        // Filter by education level
        if (educationLevel) {
            results = results.filter((s: any) =>
                s.educationLevel?.includes(educationLevel) || s.educationLevel?.includes('All')
            );
        }

        // Filter by category
        if (category) {
            results = results.filter((s: any) =>
                s.category?.includes(category) || s.category?.includes('All') || s.category?.includes('General')
            );
        }

        // Filter by state
        if (state) {
            results = results.filter((s: any) =>
                s.state === state || s.state === 'All India'
            );
        }

        // Filter by income
        if (income !== undefined && income !== null) {
            const incomeNum = Number(income);
            results = results.filter((s: any) =>
                s.incomeLimit === 0 || s.incomeLimit >= incomeNum
            );
        }

        // Filter by marks percentage
        if (marksPercentage !== undefined && marksPercentage !== null) {
            const marks = Number(marksPercentage);
            results = results.filter((s: any) =>
                s.marksRequirement === 0 || s.marksRequirement <= marks
            );
        }

        // Filter by gender (if scholarship is gender-specific)
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

        // Filter by minority status (show minority scholarships only if user is minority)
        if (minorityStatus === false) {
            results = results.filter((s: any) => !s.minorityStatus);
        }

        // Filter by disability status (show disability scholarships only if user has disability)
        if (disabilityStatus === false) {
            results = results.filter((s: any) => !s.disabilityStatus);
        }

        // Sort by deadline (nearest first)
        results.sort((a: any, b: any) => {
            const dateA = new Date(a.deadline).getTime();
            const dateB = new Date(b.deadline).getTime();
            return dateA - dateB;
        });

        return NextResponse.json({
            total: results.length,
            scholarships: results,
        });
    } catch (error) {
        console.error('Eligibility filter error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
