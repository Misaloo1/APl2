const fs = require("fs");

// 1. Write to a file
fs.writeFile("example.txt", "This is the initial content.\n", (err) => {
  if (err) throw err;
  console.log("File created and written!");

  // 2. Read the file
  fs.readFile("example.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log("File content:");
    console.log(data);

    // 3. Append more content
    fs.appendFile("example.txt", "This line was appended!\n", (err) => {
      if (err) throw err;
      console.log("Content appended!");

      // 4. Read again
      fs.readFile("example.txt", "utf8", (err, updatedData) => {
        if (err) throw err;
        console.log("Updated content:");
        console.log(updatedData);

        // 5. Delete the file
        fs.unlink("example.txt", (err) => {
          if (err) throw err;
          console.log("File deleted!");
        });
      });
    });
  });
});
