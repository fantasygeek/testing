const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Try multiple port sources for Azure compatibility
const port = process.env.PORT || process.env.WEBSITES_PORT || process.env.HTTP_PLATFORM_PORT || 8080;

app.prepare().then(() => {
  console.log('Next.js app prepared, starting server...');
  console.log('Available environment variables:');
  console.log('PORT:', process.env.PORT);
  console.log('WEBSITES_PORT:', process.env.WEBSITES_PORT);
  console.log('HTTP_PLATFORM_PORT:', process.env.HTTP_PLATFORM_PORT);
  console.log('Using port:', port);
  
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === "/a") {
      app.render(req, res, "/a", query);
    } else if (pathname === "/b") {
      app.render(req, res, "/b", query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
