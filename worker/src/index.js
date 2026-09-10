const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const jsonResponse = (data, init = {}) => {
  const headers = new Headers(corsHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');

  if (init.headers) {
    for (const [key, value] of new Headers(init.headers).entries()) {
      headers.set(key, value);
    }
  }

  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers,
  });
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'GET') {
      return jsonResponse(
        {
          error: 'Method not allowed',
        },
        { status: 405 }
      );
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/api') {
      return jsonResponse({
        ok: true,
        message: 'Worker API is running.',
        endpoints: ['/api', '/api/course', '/api/hello?name=山田'],
      });
    }

    if (pathname === '/api/course') {
      return jsonResponse({
        ok: true,
        courses: [
          {
            id: 1,
            title: '基礎Webデザイン',
            category: 'design',
            instructor: '山田',
          },
          {
            id: 2,
            title: 'Cloudflare Workers入門',
            category: 'cloud',
            instructor: '鈴木',
          },
          {
            id: 3,
            title: 'JavaScript応用演習',
            category: 'programming',
            instructor: '佐藤',
          },
        ],
      });
    }

    if (pathname === '/api/hello') {
      const name = url.searchParams.get('name');

      if (!name || name.trim() === '') {
        return jsonResponse(
          {
            error: 'name query parameter is required',
          },
          { status: 400 }
        );
      }

      return jsonResponse({
        ok: true,
        message: `Hello, ${name}!`,
        name,
      });
    }

    return jsonResponse(
      {
        ok: false,
        error: 'Not found',
        path: pathname,
      },
      { status: 404 }
    );
  },
};
