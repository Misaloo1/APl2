const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/demoDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("MongoDB Demo App");
});

app.post("/add", async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json({ message: "User added", user });
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
