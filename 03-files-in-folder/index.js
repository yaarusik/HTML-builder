const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "secret-folder");

fs.readdir(filePath, (err, files) => {
  if (err) throw err;

  files.forEach((item) => {
    fs.stat(filePath + "/" + item, (err, stats) => {
      let result = "";

      if (err) throw err;
      if (stats.isFile()) {
        result += item.replace(".", " - ");
        result += " - " + (stats.size / 1024).toFixed(3) + "kb";
        console.log(result);
      }
    });
  });
});
