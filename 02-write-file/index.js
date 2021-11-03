const fs = require("fs");
const path = require("path");

const { stdin, stdout } = process;
const fileText = path.join(__dirname, "text.txt");

stdout.write("Пожалуйста введите текст:\n");

fs.access(fileText, (err) => {
  if (err) {
  } else {
    fs.truncate(fileText, (err) => {
      if (err) throw err;
    });
  }
});

stdin.on("data", (data) => {
  // stdout.write(data);
  let a = data.toString();

  if (a.trim() == "exit") {
    console.log("До свидания, заходите ещё");
    process.exit();
  }

  fs.appendFile(fileText, data, (err) => {
    if (err) {
      throw err;
    }
  });
});

process.on("SIGINT", function () {
  console.log("До свидания, заходите ещё");
  process.exit();
});
