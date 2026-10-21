export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API для проверки ключа (ключ берем прямо из ссылки)
    if (url.pathname === '/api/check-key' && request.method === 'POST') {
      try {
        const inputKey = url.searchParams.get('key');
        
        if (!inputKey) {
           return new Response('No key provided', { status: 400 });
        }

        // Ищем в базе
        const result = await env.DB
          .prepare("SELECT * FROM access_keys WHERE key = ? AND active = 1")
          .bind(inputKey)
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

    // 2. Отдаем сайт
    return env.ASSETS.fetch(request);
  }
};
