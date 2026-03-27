import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, mobileNumber, state } = await req.json();

        if (!name || !email || !password || !mobileNumber || !state) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    mobile_number: mobileNumber,
                    state,
                    role: 'user',
                    profile: {}
                }
            }
        });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        if (!data.user) {
            return NextResponse.json({ message: 'Failed to create user' }, { status: 400 });
        }

        const token = data.session?.access_token || '';
        const requiresEmailConfirmation = !data.session;

        return NextResponse.json({
            _id: data.user.id,
            name: data.user.user_metadata?.name,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'user',
            state: data.user.user_metadata?.state,
            mobileNumber: data.user.user_metadata?.mobile_number,
            profile: data.user.user_metadata?.profile || {},
            savedScholarships: data.user.user_metadata?.saved_scholarships || [],
            token,
            requiresEmailConfirmation
        }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
