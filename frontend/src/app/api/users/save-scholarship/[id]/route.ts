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

// POST /api/users/save-scholarship/[id]
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { user, token } = auth;
        const userSupabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        await userSupabase.auth.setSession({ access_token: token, refresh_token: token });

        const currentSaved: string[] = user!.user_metadata?.saved_scholarships || [];
        const scholarshipId = String(id);
        if (!currentSaved.includes(scholarshipId)) currentSaved.push(scholarshipId);

        const { data, error } = await userSupabase.auth.updateUser({
            data: { ...user!.user_metadata, saved_scholarships: currentSaved }
        });

        if (error) return NextResponse.json({ message: 'Failed to save scholarship' }, { status: 500 });
        return NextResponse.json({ savedScholarships: data.user?.user_metadata?.saved_scholarships });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE /api/users/save-scholarship/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { user, token } = auth;
        const userSupabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        await userSupabase.auth.setSession({ access_token: token, refresh_token: token });

        let currentSaved: string[] = user!.user_metadata?.saved_scholarships || [];
        const removeId = String(id);
        currentSaved = currentSaved.filter((savedId: string) => savedId !== removeId);

        const { data, error } = await userSupabase.auth.updateUser({
            data: { ...user!.user_metadata, saved_scholarships: currentSaved }
        });

        if (error) return NextResponse.json({ message: 'Failed to remove scholarship' }, { status: 500 });
        return NextResponse.json({ savedScholarships: data.user?.user_metadata?.saved_scholarships });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
