import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user || !data.session) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        return NextResponse.json({
            _id: data.user.id,
            name: data.user.user_metadata?.name,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'user',
            state: data.user.user_metadata?.state,
            mobileNumber: data.user.user_metadata?.mobile_number,
            profile: data.user.user_metadata?.profile || {},
            savedScholarships: data.user.user_metadata?.saved_scholarships || [],
            token: data.session.access_token
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
