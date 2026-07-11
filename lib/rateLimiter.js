const rateLimitMap = new Map();

function getRateLimitKey(identifier) {
  return `ratelimit:${identifier}`;
}

export function rateLimit({ windowMs = 60000, max = 5, message = 'Too many requests. Please try again later.' } = {}) {
  return async function checkRateLimit(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const url = new URL(request.url);
    const key = getRateLimitKey(`${ip}:${url.pathname}`);

    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now - record.start > windowMs) {
      rateLimitMap.set(key, { count: 1, start: now });
      return null;
    }

    record.count++;

    if (record.count > max) {
      const retryAfter = Math.ceil((record.start + windowMs - now) / 1000);
      return new Response(
        JSON.stringify({ success: false, error: message }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil((record.start + windowMs) / 1000)),
          },
        }
      );
    }

    return null;
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.start > 120000) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);
