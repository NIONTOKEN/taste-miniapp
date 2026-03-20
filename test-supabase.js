const SUPABASE_URL = "https://bhwabftkecxrvrkqilyz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJod2FiZnRrZWN4cnZya3FpbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjQ4MjUsImV4cCI6MjA4ODU0MDgyNX0.uYuW_yn0Y0ri5pmtqk2kBQ1tb4okokFzZmakuGtd1vU"

const H = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
}

async function testFetch() {
    console.log("Fetching JOBS from Supabase...");
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*`, { headers: H });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Jobs Count:", data.length);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.log(e);
    }
}

testFetch();
