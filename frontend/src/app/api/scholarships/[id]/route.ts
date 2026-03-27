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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const { data, error } = await supabase
            .from('scholarships')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Supabase fetch error:', error.message);
            return NextResponse.json({ message: 'Database error' }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        return NextResponse.json(mapToFrontend(data));
    } catch (error) {
        console.error('Single scholarship API error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
