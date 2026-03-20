

const SUPABASE_URL = "https://bhwabftkecxrvrkqilyz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJod2FiZnRrZWN4cnZya3FpbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjQ4MjUsImV4cCI6MjA4ODU0MDgyNX0.uYuW_yn0Y0ri5pmtqk2kBQ1tb4okokFzZmakuGtd1vU"

const H = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

async function testPost() {
    console.log("Testing JOBS POST...");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
        method: 'POST',
        headers: H,
        body: JSON.stringify({
            title: "Test Job",
            description: "Test description",
            city: "İstanbul",
            salary: "1000",
            employer_name: "Test",
            employer_emoji: "🏢",
            employer_username: "@test",
            is_active: true,
            job_type: "listing"
        })
    });
    if (!res.ok) {
        console.error("ERROR:", await res.text());
    } else {
        console.log("SUCCESS:", await res.json());
    }
}

testPost();
