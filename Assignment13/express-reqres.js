const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GET request received");
});

app.get("/user", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello, ${name}`);
});

app.post("/data", (req, res) => {
  res.json({ received: req.body });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
