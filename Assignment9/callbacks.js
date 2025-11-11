// A simple Node.js program to demonstrate callbacks

// Function that takes a callback
function fetchData(callback) {
    console.log("Fetching data...");

    // Simulating an async operation
    setTimeout(() => {
        const data = { id: 1, name: "Callback Example" };

        console.log("Data fetched!");
        
        // Calling the callback function with the result
        callback(data);
    }, 2000);
}

// Calling the function and passing a callback
fetchData(function(result) {
    console.log("Callback executed!");
    console.log("Received data:", result);
});
