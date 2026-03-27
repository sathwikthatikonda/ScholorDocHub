import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPragati() {
    const { data, error } = await supabase
        .from('scholarships')
        .select('name, gender')
        .ilike('name', '%Pragati%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Results:');
    console.log(JSON.stringify(data, null, 2));
}

checkPragati();
