import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'mock-key';

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("✅ Using SUPABASE_SERVICE_ROLE_KEY (Should bypass RLS)");
} else {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is MISSING in environment. Using ANON_KEY (Will be blocked by RLS!)");
}

if (supabaseUrl === 'https://mock.supabase.co') {
    console.warn("⚠️ SUPABASE_URL or SUPABASE_KEY is missing in .env file. Using mock URLs to prevent crashes, but database calls will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
