const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Serve ticket_sales.html for the root path
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'ticket_sales.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading the page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}); 