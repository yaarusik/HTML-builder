const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
// console.log(filePath);

const data = fs.createReadStream(filePath, "utf-8");

data.on("data", (data) => console.log(data));
