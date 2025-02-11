const fs = require("fs").promises;
const path = require("path");

const componentsPath = path.join(__dirname, "components");
const templateFile = path.join(__dirname, "template.html");
const newPath = path.join(__dirname, "project-dist");
const newIndexHtml = path.join(newPath, "index.html");
const stylePath = path.join(__dirname, "styles");
const newStyleCss = path.join(newPath, "style.css");
const newImgPath = path.join(newPath, "assets");
const imgPath = path.join(__dirname, "assets");

let componentsArr = [];

// считал данные template
async function readFile(filePath) {
  try {
    return (data = await fs.readFile(filePath));
  } catch (e) {
    console.log("error", e);
  }
}

async function readDir(filePath) {
  try {
    const files = await fs.readdir(filePath);
    // console.log(files);
    for (let item of files) {
      await addFilesToArr(item, filePath);
    }
  } catch (error) {
    console.log("error", error);
  }
}

// считал данные из файлов components и записал в массив
async function addFilesToArr(item, dir) {
  try {
    let itemPath = path.join(dir, item);
    let data = await fs.stat(itemPath);
    if (
      (data.isFile() && path.extname(itemPath) == ".html") ||
      (data.isFile() && path.extname(itemPath) == ".css")
    ) {
      let innerData = await fs.readFile(itemPath, "utf-8");
      componentsArr.push(innerData);
    }
  } catch (err) {
    console.log("error", err);
  }
}

// заменяем теги на компоненты
async function changeTags(template) {
  let file = template.toString();
  const tags = file.match(/{{.*}}/gi);
  let a = [];
  for (let item of tags) {
    a.push(item.replace(" ", ","));
  }
  a = a.join(",").split(",");
  for (let item of a) {
    const tagFile = item.substr(2, item.length - 4);
    console.log(tagFile);
    const component = await fs.readFile(
      path.join(componentsPath, `${tagFile}.html`)
    );
    file = file.replace(item, component.toString());
  }
  // console.log(file);
  // file = file
  //   .replace(/\{\{header\}\}/, componentsArr[componentsArr.length - 1])
  //   .replace(/\{\{footer\}\}/, componentsArr[componentsArr.length - 2])
  //   .replace(/\{\{articles\}\}/, componentsArr[componentsArr.length - 3])
  //   .replace(/\{\{about\}\}/, componentsArr[componentsArr.length - 4]);

  return file;
}

async function createDir(dir) {
  let projectDist = await fs.mkdir(dir, { recursive: true });
}

async function addFile(file, inner = "") {
  await fs.appendFile(file, inner);
}

async function createStyle(arr) {
  let styleCss = "";
  for (let item of arr) {
    styleCss += item;
  }
  return styleCss;
}

async function deleteInner(filePath) {
  try {
    await fs.access(filePath);
    await fs.truncate(filePath);
  } catch (e) {}
}

// удаляем содержимое папок
async function checkUpdateAssets(newImgPath) {
  try {
    await fs.access(newImgPath);
    const files = await fs.readdir(newImgPath);
    files.forEach(async (file) => {
      const newFile = path.join(newImgPath, file);
      const stat = await fs.stat(newFile);
      if (stat.isDirectory()) {
        await checkUpdateAssets(newFile);
      } else {
        await fs.unlink(newFile);
      }
    });
  } catch (error) {}
}

// отслеживаем удаление папки
async function delAssetsPath(imgPath, newImgPath) {
  try {
    await fs.access(newImgPath);
    let indicator = [];
    const files = await fs.readdir(imgPath);
    const newFiles = await fs.readdir(newImgPath);

    if (files.length != newFiles.length) {
      newFiles.forEach(async (file) => {
        indicator.push(file);
      });
      files.forEach(async (file) => {
        indicator = indicator.filter((item) => item != file);
      });
      indicator.forEach(async (file) => {
        await checkUpdateAssets(newImgPath);
        await fs.rmdir(path.join(newImgPath, file));
      });
    }
  } catch (error) {}
}

// копируем и обновляем папку
async function copyAssets(newImgPath, imgPath) {
  await fs.mkdir(newImgPath, { recursive: true });
  const files = await fs.readdir(imgPath);

  files.forEach(async (file) => {
    const origFile = path.join(imgPath, file);
    const newFile = path.join(newImgPath, file);
    const stat = await fs.stat(origFile);
    if (stat.isDirectory()) {
      copyAssets(newFile, origFile);
    } else {
      await fs.copyFile(origFile, newFile);
    }
  });
}

// запускаем build
(async function () {
  let innerTemplate = await readFile(templateFile);
  await readDir(componentsPath);
  let indexFile = await changeTags(innerTemplate);
  await createDir(newPath);
  await deleteInner(newIndexHtml);
  await addFile(newIndexHtml, indexFile);

  componentsArr = [];
  await readDir(stylePath);
  let styleCss = await createStyle(componentsArr);
  await deleteInner(newStyleCss);
  await addFile(newStyleCss, styleCss);

  await checkUpdateAssets(newImgPath);
  await delAssetsPath(imgPath, newImgPath);
  await copyAssets(newImgPath, imgPath);
})();
