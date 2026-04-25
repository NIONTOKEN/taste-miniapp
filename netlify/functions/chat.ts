// ─── Basit in-memory rate limiter ───────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string, maxReq = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxReq;
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: { message: 'Too many requests. Please wait.' } }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "GROQ API Key is missing on the server. Please add GROQ_API_KEY to your Netlify Environment Variables." } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: body.model || 'llama-3.3-70b-versatile',
        messages: body.messages,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 600,
        top_p: body.top_p || 0.9,
      })
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const config = {
  path: "/api/chat"
};
