import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    let target = file;
    try {
      if (!(await fs.stat(target)).isFile())
        target = path.join(root, 'index.html');
    } catch {
      if (path.extname(pathname)) {
        res.writeHead(404).end('Not found');
        return;
      }
      target = path.join(root, 'index.html');
    }
    const data = await fs.readFile(target);
    res.writeHead(200, {
      'Content-Type': types[path.extname(target)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  } catch {
    res.writeHead(500).end('Unable to serve application');
  }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () =>
  console.log(`ANIMA preview: http://127.0.0.1:${process.env.PORT || 4173}`),
);
