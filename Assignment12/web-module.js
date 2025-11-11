const http = require("http");
const PORT = 3000;

// Create a web server
const server = http.createServer((req, res) => {
    // Set response header
    res.writeHead(200, { "Content-Type": "text/html" });

    if (req.url === "/") {
        res.end("<h1>Welcome to Node.js Web Module Demo</h1><p>This is the home page</p>");
    } 
    else if (req.url === "/about") {
        res.end("<h1>About Page</h1><p>This is a simple Node.js server using the HTTP module.</p>");
    } 
    else {
        res.writeHead(404);
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
