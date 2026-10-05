// 005 Static file server for the browser tests. Python's http.server queues only a few connections,
// which made parallel Playwright runs flaky (requests stalled or were refused). No dependencies.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT ?? 8000);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = normalize(join(ROOT, path.endsWith('/') ? `${path}index.html` : path));
  if (file !== ROOT && !file.startsWith(ROOT + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
