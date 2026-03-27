import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function countRows() {
    const { count, error } = await supabase.from('scholarships').select('*', { count: 'exact', head: true });
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Total Scholarships in DB:", count);
    }
}

countRows();
