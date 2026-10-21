export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/check-key' && request.method === 'POST') {
      try {
        const body = await request.json();
        const inputKey = (body.key || '').trim();

        const result = await env.DB
          .prepare("SELECT * FROM access_keys WHERE key = ? AND active = 1")
          .bind(inputKey)
          .first();
        
        if (result) {
          return new Response(JSON.stringify({ valid: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({ valid: false }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {
        return new Response(JSON.stringify({ valid: false, error: e.message }), { 
          status: 500, headers: { 'Content-Type': 'application/json' } 
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
