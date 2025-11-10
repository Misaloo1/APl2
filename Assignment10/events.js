// Demonstrating Node.js Events

const EventEmitter = require("events");

// Create an EventEmitter object
const eventEmitter = new EventEmitter();

// Register an event listener
eventEmitter.on("greet", (name) => {
    console.log(`Hello, ${name}! The 'greet' event was triggered.`);
});

// Trigger the event
console.log("Emitting 'greet' event...");
eventEmitter.emit("greet", "Alice");

// Another event example
eventEmitter.on("dataReceived", (data) => {
    console.log("Data received:", data);
});

// Emit second event
eventEmitter.emit("dataReceived", { id: 1, message: "Event system working!" });
