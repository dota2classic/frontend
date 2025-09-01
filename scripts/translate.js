const fs = require("fs");
const path = require("path");
const { create } = require("apisauce");
require("dotenv").config();

const folderPath = "i18n"; // замените на ваш путь

function areStringArraysEqual(arr1, arr2) {
  // Check if both are arrays
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  // Check if lengths are equal
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Compare each element
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // All elements are equal
  return true;
}

const system2 = `
Ты — помощник, который переводит JSON-объекты с русскими строками на английские, сохраняя структуру и ключи без изменений.  
Твоя задача — пройтись по всему JSON и заменить только строки, являющиеся значениями, на их английские эквиваленты.  
Если значение — это строка на русском языке, переведи её на английский.  
Если значение — это другой тип данных (число, логическое, массив, объект), оставь его без изменений.  
Обеспечь точность и сохранение исходной структуры JSON.  

Пример:  
Вход:  
\`\`\`json
{
  "match_page.matchId": "Матч {{matchId}}",
  "match_page.seo.title": "Матч {{matchId}}",
  "match_page.seo.description": "Матч {{matchId}}, сыгранный на сайте dotaclassic.ru"
}

Выход:  
\`\`\`json
{
  "match_page.matchId": "Match {{matchId}}",
  "match_page.seo.title": "Match {{matchId}}",
  "match_page.seo.description": "Match {{matchId}} played on dotaclassic.ru"
}

Обрати внимание:

Перевод должен быть точным и корректным.
Не переводить ключи, только значения.
Обеспечить, чтобы итоговый JSON оставался валидным.
Начинай работу, когда я предоставлю JSON.
`;

const _api = create({
  baseURL: "https://api.proxyapi.ru/openai",
  headers: {
    Authorization: `Bearer ${process.env.GPT_TOKEN}`,
  },
});

async function generateKey(text) {
  const request = {
    // model: "gpt-4.1-nano",
    // model: "gpt-4o-mini",
    model: "gpt-5-nano",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: system2,
      },
      {
        role: "user",
        content: text,
      },
    ],
  };

  const res = await _api.post(`/v1/chat/completions`, request);

  if (res.ok) {
    return JSON.parse(res.data.choices[0].message.content);
  }
  console.error("There was an issue getting GPT answer!", res.originalError);
  console.error(res.data);
}

async function translate2() {
  const localePath = path.join(folderPath, "ru");
  const files = fs.readdirSync(localePath);

  // Фильтруем только JSON-файлы
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json",
  );

  for (const file of jsonFiles) {
    const filePath = path.join(localePath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const result = await generateKey(fileContent);
    if (!areStringArraysEqual(Object.keys(result), Object.keys(result))) {
      console.warn("Некоторые ключи не совпали!");
    }

    fs.writeFileSync(`i18n/en/${file}`, JSON.stringify(result, null, 2));
    console.log(`Translated file ${file}`);
  }
}

translate2();
