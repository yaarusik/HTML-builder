const fs = require("fs");
const path = require("path");

let newPath = path.join(__dirname, "files-copy");
let filePath = path.join(__dirname, "files");

fs.mkdir(newPath, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

// удаляем файлы директории

fs.readdir(newPath, (err, files) => {
  if (err) throw err;

  files.forEach((item) => {
    let newFile = path.join(newPath, item);

    fs.unlink(newFile, (err) => {
      if (err) throw err;
    });
  });
});

// обновляем файлы директории

fs.readdir(filePath, (err, files) => {
  if (err) throw err;

  files.forEach((item) => {
    let file = path.join(filePath, item);
    let newFile = path.join(newPath, item);

    fs.copyFile(file, newFile, (err) => {
      if (err) throw err;
    });
  });
});
