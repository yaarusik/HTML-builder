const { create } = require("domain");
const fs = require("fs");
const path = require("path");

const cssPath = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");

let readArr = [];
let i = 0;
fs.access(bundlePath, (err) => {
  if (err) {}
  else {
   
    fs.truncate(bundlePath, (err) => {
      if (err) throw err;
    });
  }
});

fs.readdir(cssPath, (err, files) => {
  if (err) throw err;

  files.forEach((item) => {
    let pathItem = path.join(cssPath, item);

    fs.stat(pathItem, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(pathItem) == ".css") {
        fs.readFile(pathItem, "utf-8", (err, data) => {
          if (err) throw err;

          readArr.push(data);
          
          createStyleFile(readArr[i]);
          i++;
        });
      }
    });
  });
});

function createStyleFile(arr) {
  fs.appendFile(bundlePath, arr, (err) => {
    if (err) {
      throw err;
    }
  });
}
