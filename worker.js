export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Send a URL in the 'url' query parameter", { status: 400 });
    }

    // Modern headers to trick sites into thinking we are a real browser
    const headers = new Headers({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    });

    try {
      const response = await fetch(targetUrl, { headers });
      
      // Clone the response so we can modify headers
      const newResponse = new Response(response.body, response);
      
      // CRITICAL: This allows your PWA to see the data
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
      
      return newResponse;
    } catch (e) {
      return new Response("Proxy error: " + e.message, { status: 500 });
    }
  }
};