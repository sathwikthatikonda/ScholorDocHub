import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'mock-key';

if (supabaseUrl === 'https://mock.supabase.co') {
    console.warn("⚠️ SUPABASE_URL or SUPABASE_KEY is missing in .env file. Using mock URLs to prevent crashes, but database calls will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
