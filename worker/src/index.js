const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const courses = [
  { id: 1, title: '基礎Webデザイン', category: 'design', instructor: '山田' },
  { id: 2, title: 'Cloudflare Workers入門', category: 'cloud', instructor: '鈴木' },
  { id: 3, title: 'JavaScript応用演習', category: 'programming', instructor: '佐藤' },
];

const fortunes = [
  { label: '大吉', message: '今日は最高の一日です。積極的に行動すると良い結果が見えます。', advice: '新しい挑戦に前向きに取り組みましょう。' },
  { label: '中吉', message: '焦らず丁寧に進めば、思わぬラッキーが待っています。', advice: '一歩ずつ着実に進めると良い結果につながります。' },
  { label: '小吉', message: '小さな好機がいくつかある日です。気づきを大切にしましょう。', advice: '細かなことを丁寧にこなすと運が開きます。' },
  { label: '吉', message: '落ち着いて行動すると、意外な形で助けが届きます。', advice: '余裕を持って判断するのが吉です。' },
  { label: '凶', message: '今日は無理をせず、休むことを優先してよい日です。', advice: '慎重に進めて、体調と気分を整えましょう。' },
];

const events = [
  { id: 1, title: 'Cloudflare勉強会', date: '2026-09-20', location: 'オンライン', category: 'tech' },
  { id: 2, title: 'フロントエンド交流会', date: '2026-09-27', location: '東京', category: 'community' },
  { id: 3, title: 'Webアプリ開発ハッカソン', date: '2026-10-05', location: '大阪', category: 'hackathon' },
];

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

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/api') {
      return jsonResponse({
        ok: true,
        message: 'Worker API is running.',
        endpoints: [
          '/api',
          '/api/course',
          '/api/hello?name=山田',
          '/api/fortune?name=山田',
          '/api/events',
        ],
      });
    }

    if (pathname === '/api/course') {
      return jsonResponse({ ok: true, courses });
    }

    if (pathname === '/api/hello') {
      const name = url.searchParams.get('name');

      if (!name || name.trim() === '') {
        return jsonResponse({ error: 'name query parameter is required' }, { status: 400 });
      }

      return jsonResponse({
        ok: true,
        message: `Hello, ${name}!`,
        name,
      });
    }

    if (pathname === '/api/fortune') {
      const name = url.searchParams.get('name') || 'あなた';
      const fortune = pickRandom(fortunes);

      return jsonResponse({
        ok: true,
        name,
        fortune: fortune.label,
        message: fortune.message,
        advice: fortune.advice,
      });
    }

    if (pathname === '/api/events') {
      return jsonResponse({ ok: true, events });
    }

    return jsonResponse({ ok: false, error: 'Not found', path: pathname }, { status: 404 });
  },
};
