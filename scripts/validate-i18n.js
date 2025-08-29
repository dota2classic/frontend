const fs = require("fs");
const path = require("path");

function validateFile(file) {
  const isPage = file.includes("_page");

  let totalKeys = 0;
  const _content = JSON.parse(fs.readFileSync(file));
  Object.entries(_content).forEach(([key, value]) => {
    totalKeys += Object.keys(value).length;
  });

  if (totalKeys === 0) {
    console.error(`Файл ${file}: нет ключей`);
  }

  if (isPage) {
    const content = _content[Object.keys(_content)[0]];
    if ("seo" in content) {
      if (!content.seo.title || !content.seo.description) {
        console.error(`Файл ${file} невалиден: нет seo`);
      }
    } else {
      console.error(`Файл ${file} невалиден: нет seo`);
    }
  }
}

const folderPath = "i18n"; // замените на ваш путь

// Получаем список всех файлов в папке
const locales = fs.readdirSync(folderPath);

locales.forEach((locale) => {
  const localePath = path.join(folderPath, locale);
  const files = fs.readdirSync(localePath);

  // Фильтруем только JSON-файлы
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json",
  );

  // Проходим по каждому JSON-файлу и объединяем содержимое
  jsonFiles.forEach((file) => {
    const filePath = path.join(localePath, file);
    validateFile(filePath);
  });
});
