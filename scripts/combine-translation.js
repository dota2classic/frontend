const fs = require("fs");
const path = require("path");

const folderPath = "i18n"; // замените на ваш путь

// Получаем список всех файлов в папке
const files = fs.readdirSync(folderPath);

// Фильтруем только JSON-файлы
const jsonFiles = files.filter(
  (file) => path.extname(file).toLowerCase() === ".json",
);

let combinedData = {};

// Проходим по каждому JSON-файлу и объединяем содержимое
jsonFiles.forEach((file) => {
  const filePath = path.join(folderPath, file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  try {
    const jsonData = JSON.parse(fileContent);
    // Объединяем объекты (можно изменить стратегию объединения по необходимости)
    combinedData = { ...combinedData, ...jsonData };
  } catch (err) {
    console.error(`Ошибка парсинга файла ${file}:`, err);
  }
});

fs.writeFileSync("src/i18n/raw.json", JSON.stringify(combinedData, null, 2));
