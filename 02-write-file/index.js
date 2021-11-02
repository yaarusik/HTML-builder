const fs = require("fs");
const path = require("path");

const { stdin, stdout } = process;

stdout.write("Пожалуйста введите текст:\n");

stdin.on("data", (data) => {
  // stdout.write(data);
  let a = data.toString();

  if (a.trim() == "exit") {
    console.log("До свидания, заходите ещё");
    process.exit();
  }

  fs.appendFile(path.join(__dirname, "text.txt"), data, (err) => {
    if (err) {
      throw err;
    }
  });
});

process.on("SIGINT", function () {
  console.log("До свидания, заходите ещё");
  process.exit();
});
