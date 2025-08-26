const fs = require("fs");
const path = require("path");

const folderPath = "i18n"; // замените на ваш путь

// Получаем список всех файлов в папке
const locales = fs.readdirSync(folderPath);

// Простая функция глубокого слияния с предупреждениями
function deepMerge(target, source, pathStack = []) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const currentPath = [...pathStack, key];
      if (
        typeof target[key] === "object" &&
        target[key] !== null &&
        typeof source[key] === "object" &&
        source[key] !== null
      ) {
        // Рекурсивное слияние вложенных объектов
        deepMerge(target[key], source[key], currentPath);
      } else {
        if (key in target) {
          console.warn(`Перезапись ключа: ${currentPath.join(".")}`);
        }
        target[key] = source[key];
      }
    }
  }
}

locales.forEach((locale) => {
  const localePath = path.join(folderPath, locale);
  const files = fs.readdirSync(localePath);

  // Фильтруем только JSON-файлы
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json",
  );

  let combinedData = {};

  // Проходим по каждому JSON-файлу и объединяем содержимое
  jsonFiles.forEach((file) => {
    const filePath = path.join(localePath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      const jsonData = JSON.parse(fileContent);
      // Объединяем объекты (можно изменить стратегию объединения по необходимости)

      deepMerge(combinedData, jsonData, [file]);
    } catch (err) {
      console.error(`Ошибка парсинга файла ${file}:`, err);
    }
  });

  fs.writeFileSync(
    `src/i18n/${locale}.json`,
    JSON.stringify(combinedData, null, 2),
  );
});
