export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/check-key' && request.method === 'POST') {
      try {
        const inputKey = url.searchParams.get('key');
        
        if (!inputKey) {
           return new Response(JSON.stringify({ valid: false, error: "No key" }), { status: 400 });
        }

        // Ищем ключ, убирая лишние пробелы в самой базе через TRIM, на случай если они там есть
        const result = await env.DB
          .prepare("SELECT * FROM access_keys WHERE TRIM(key) = ? AND active = 1")
          .bind(inputKey.trim())
          .first();
        
        return new Response(JSON.stringify({ valid: !!result }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ valid: false, error: e.message }), { 
          status: 500, headers: { 'Content-Type': 'application/json' } 
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
