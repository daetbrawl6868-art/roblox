export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API для проверки ключа
    if (url.pathname === '/api/check-key' && request.method === 'POST') {
      try {
        const { key } = await request.json();
        const result = await env.DB
          .prepare("SELECT * FROM access_keys WHERE key = ? AND active = 1")
          .bind(key)
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

    // 2. Все остальные запросы отдаем как статику (твой index.html)
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
};
