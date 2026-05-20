const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..', 'packages', 'core', 'dist');
const port = Number(process.env.PORT || 8081);

const types = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.map': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const sendFile = (res, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
    });
};

http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const requestedPath = path.normalize(path.join(root, decodedPath));

    if (!requestedPath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(requestedPath, (error, stat) => {
        if (!error && stat.isFile()) {
            sendFile(res, requestedPath);
            return;
        }

        if (!error && stat.isDirectory()) {
            const indexPath = path.join(requestedPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                sendFile(res, indexPath);
                return;
            }
        }

        sendFile(res, path.join(root, 'index.html'));
    });
}).listen(port, '127.0.0.1', () => {
    console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
