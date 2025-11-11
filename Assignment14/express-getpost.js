const express = require("express");
const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("GET request received");
});

app.post("/hello", (req, res) => {
  res.json({ message: "POST request received", body: req.body });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
