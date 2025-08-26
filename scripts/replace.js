require('dotenv').config();

const system2 = `
## Твоя роль
Ты - эксперт по интернационализации react приложеий. Мы переводим проект, где все тексты захардкожены на полноценную интернационализацию - далее i18n.
Мы итерируем по всем строковым литералам в коде и заменяем их на вызов к t("translation_key_name"). Ты получаешь на вход код компонента и его путь в виде комментария в 1 строке.
Твоя задача - преобразовать код компонента, чтобы вместо захардкоженных текстов использовались вызовы к t("i18nkey"). Учитывай параметризацию: паттерны вроде <button>{variable}.dem</button>, то нужно сделать строку перевода с шаблоном и учесть это в коде.
Ответ нужно выдавать в формате JSON объекта с 2 ключами:
{
    "code": "<новый код компонента с примененной локализацией>",
    "i18n": "<json с переводами>",
    "i18n_filename": "уникальное названия файла для компонента"
}

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
      <h1>{t('error_page.pageLoadFailed', { statusCode })}</h1>
      <PageLink link={AppRouter.index.link}>
        <h3 className="green">{t('error_page.returnHome')}</h3>
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

  console.log(process.env.GPT_TOKEN)

  async function generateKey(text) {
    const request = {
      model: "gpt-4o-mini",
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
  }

  const { code, i18n, i18n_filename } = await generateKey(`// ${fileInfo.path}
${fileInfo.source}`);

  console.log(code, i18n, i18n_filename);

  require("fs").writeFileSync(
    `i18n/${i18n_filename}.json`,
    JSON.stringify(i18n, null, 2),
  );

  return code;

  // const j = api.jscodeshift;
  //
  // const some = j(fileInfo.source);
  //
  // const fetches = [];
  //
  // const i18n = {};
  //
  // const x = some.find(j.JSXText).forEach((path) => {
  //   // Only process non-empty strings
  //   if (typeof path.node.value === "string" && path.node.value.trim() !== "") {
  //     // Push async operation into fetches array
  //     fetches.push(
  //       (async () => {
  //         const identifier = await generateKey(path.node.value.trim());
  //
  //         const tCall = j.callExpression(j.identifier("t"), [
  //           j.stringLiteral(identifier),
  //         ]);
  //
  //         i18n[identifier] = path.node.value.trim();
  //
  //         // Replace node with JSXExpressionContainer wrapping tCall
  //         j(path).replaceWith(j.jsxExpressionContainer(tCall));
  //       })(),
  //     );
  //   }
  // });
  //
  // // Wait for all async operations to complete
  // await Promise.all(fetches);
  //
  // require("fs").writeFileSync(
  //   `i18n/${rootKey}.json`,
  //   JSON.stringify(i18n, null, 2),
  // );
  // return some.toSource();
};
