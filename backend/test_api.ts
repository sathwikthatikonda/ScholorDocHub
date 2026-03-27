
import axios from 'axios';

async function test() {
    try {
        const res = await axios.get('http://localhost:5000/api/scholarships');
        console.log(`Received ${res.data.length} scholarships from DB!`);
        if (res.data.length > 0) {
            console.log('First scholarship:', res.data[0].name);
        }
    } catch (err: any) {
        console.error('Error fetching scholarships:', err.message);
    }
}

test();
