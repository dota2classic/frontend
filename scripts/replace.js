require("dotenv").config();

const system2 = `
## Твоя роль
Ты - эксперт по интернационализации react приложеий. Мы переводим проект, где все тексты захардкожены на полноценную интернационализацию - далее i18n.
Мы итерируем по всем строковым литералам в коде и заменяем их на вызов к t("translation_key_name"). Ты получаешь на вход код компонента и его путь в виде комментария в 1 строке.
Твоя задача - преобразовать код компонента, чтобы вместо захардкоженных текстов использовались вызовы к t("i18nkey"). Учитывай параметризацию: паттерны вроде <button>{variable}.dem</button>, то нужно сделать строку перевода с шаблоном и учесть это в коде.
Ответ нужно выдавать в формате JSON объекта с 2 ключами:
{
    "code": "<новый код компонента с примененной локализацией>",
    "i18n": "<json с переводами>",
    "i18n_filename": "имя_компонента_в_snake_case"
}

Если в переданном компоненте уже присутствует интернационализация(вызовы t("...."), хук useTranslation()) либо он в ней не нуждается(нет захардкоженных текстов), то необходимо вернуть следующий JSON:
{
    "ignore": true
}

В i18n JSON передавать не строкой, а уже готовым объектом с переводами.
В i18n JSON необходимо использовать следующий формат:
{
    "unique_component_root_key": {
        "i18nkey1": "value"
    }
}
В JSON должен быть только 1 ключ - уникальный ключ для компонента, а в нем уже содержатся ключи для переводов внутри компонента
Для названия файла используй snake_case

## Примеры
На вход получаем:
// src/pages/_error.tsx
import { PageLink } from "@/components";
import { AppRouter } from "@/route";

export default function Error500({ statusCode }: { statusCode: number }) {
  return (
    <>
      <h1>Возникла ошибка при загрузке страницы {statusCode}</h1>
      <PageLink link={AppRouter.index.link}>
        <h3 className="green">Вернуться на главную</h3>
        <>code</>
      </PageLink>
    </>
  );
}

На выход хотим увидеть код:

import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import { useTranslation } from 'react-i18next';

export default function Error500({ statusCode }: { statusCode: number }) {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("error_page.pageLoadFailed", { statusCode })}</h1>
      <PageLink link={AppRouter.index.link}>
        <h3 className="green">{t("error_page.returnHome")}</h3>
        <>{t("error_page.code")}</>
      </PageLink>
    </>
  );
}

и JSON с ключами:
{
  "error_page": {
    "pageLoadFailed": "An error occurred while loading the page {{statusCode}}",
    "returnHome": "Return to the main page"
  }
}


`;

const create = require("apisauce").create;
module.exports = async function (fileInfo, api) {
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

  const { code, i18n, i18n_filename, ignore } =
    await generateKey(`// ${fileInfo.path}
${fileInfo.source}`);

  if (ignore) {
    console.warn(`Ignoring Already processed file : ${fileInfo.path}`);
    return fileInfo.source;
  }

  console.log(i18n);

  let filename = i18n_filename;

  if (!filename.endsWith(".json")) {
    filename += ".json";
  }

  require("fs").writeFileSync(
    `i18n/ru/${filename}`,
    JSON.stringify(i18n, null, 2),
  );

  return code;
};
