
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

async function check() {
    const { data, count, error } = await supabase.from('scholarships').select('*', { count: 'exact' });
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Count:', count);
        console.log('Data sample:', data.slice(0, 1));
    }
}
check();
