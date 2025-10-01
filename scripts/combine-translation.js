const fs = require("fs");
const path = require("path");

const folderPath = "i18n"; // замените на ваш путь

// Получаем список всех файлов в папке
const locales = fs.readdirSync(folderPath);

function checkMissingKeys(base, target, path = "") {
  const missing = [];

  for (const key in base) {
    const fullPath = path ? `${path}.${key}` : key;

    if (!(key in target)) {
      missing.push(fullPath);
      continue;
    }

    if (
      base[key] !== null &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      missing.push(...checkMissingKeys(base[key], target[key], fullPath));
    }
  }

  return missing;
}

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

function flattenObject(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Recursively flatten nested objects
        flattenObject(value, newKey, result);
      } else {
        // Assign value to the flattened key
        result[newKey] = value;
      }
    }
  }
  return result;
}

const allLocales = {};
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

  const flat = flattenObject(combinedData);
  fs.writeFileSync(`src/i18n/${locale}.json`, JSON.stringify(flat, null, 2));

  allLocales[locale] = combinedData;

  if (locale === "ru") {
    const plurals = ["_one", "_few", "_many", "_other"];

    const rawKeys = Array.from(
      new Set(
        Object.keys(flat).map((t) => {
          for (const plural of plurals) {
            if (t.endsWith(plural)) {
              return t.replace(plural, "");
            }
          }
          return t;
        }),
      ),
    );
    const typeDeclaration = rawKeys.map((key) => `  | "${key}"`).join("\n");
    fs.writeFileSync(
      "src/TranslationKey.d.ts",
      `export type TranslationKey =\n${typeDeclaration};\n`,
    );
  }
});


const missing = checkMissingKeys(allLocales["ru"], allLocales["en"]);
missing
  .filter(
    (it) =>
      !it.endsWith("_long") && !it.endsWith("_few") && !it.endsWith("_many"),
  )
  .forEach((miss) => {
    console.log(`Missing key: ${miss}`);
  });
