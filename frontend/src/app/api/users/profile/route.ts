import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

async function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error ? null : { user, token };
}

// GET /api/users/profile
export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { user } = auth;
    return NextResponse.json({
        _id: user!.id,
        id: user!.id,
        name: user!.user_metadata?.name,
        email: user!.email,
        role: user!.user_metadata?.role || 'user',
        state: user!.user_metadata?.state,
        mobileNumber: user!.user_metadata?.mobile_number,
        profile: user!.user_metadata?.profile || {},
        savedScholarships: user!.user_metadata?.saved_scholarships || []
    });
}

// PUT /api/users/profile
export async function PUT(req: NextRequest) {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    try {
        const { user, token } = auth;
        const body = await req.json();

        const userSupabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false }
        });

        await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        const currentProfile = user!.user_metadata?.profile || {};
        const updatedProfile = { ...currentProfile, ...body.profile };

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...user!.user_metadata,
                profile: updatedProfile
            }
        });

        if (error) return NextResponse.json({ message: error.message }, { status: 500 });

        return NextResponse.json({
            _id: data.user?.id,
            name: data.user?.user_metadata?.name,
            email: data.user?.email,
            role: data.user?.user_metadata?.role || 'user',
            state: data.user?.user_metadata?.state,
            profile: data.user?.user_metadata?.profile || {},
            savedScholarships: data.user?.user_metadata?.saved_scholarships || []
        });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
