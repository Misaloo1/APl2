// Simple Web-based Node.js Application using Express.js

const express = require("express");
const app = express();
const PORT = 3000;

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Web-Based Node.js App</h1>
    <p>Go to <a href="/hello?name=YourName">/hello?name=YourName</a></p>
  `);
});

// Example route with query parameter
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello, ${name}! This is a web-based Node.js application.`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
