const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("=== Console-Based Node.js Application ===");

rl.question("What is your name? ", (name) => {
  console.log(`Hello, ${name}! Welcome to the console app.`);
  rl.close();
});