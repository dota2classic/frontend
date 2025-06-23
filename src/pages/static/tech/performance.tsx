import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import c from "@/pages/static/Static.module.scss";
import React from "react";
import { TechStaticTabs } from "@/containers";
import {
  CoolList,
  CopyBlock,
  CopySomething,
  EmbedProps,
  Input,
  Table,
} from "@/components";

export default function PerformanceTechTab() {
  return (
    <div className={cx(NotoSans.className, c.container)}>
      <EmbedProps
        title="Улучшение производительности Dota 2 6.84"
        description="Улучшение FPS и ping для игры"
      />
      <TechStaticTabs />
      <h1>Настройки производительности</h1>

      <h2>Убираем сильные лаги на хорошем ПК</h2>
      <p>
        Исправляем баг в клиенте 6.84 - главный сайт dota2 внутри игры забивает
        процессор
      </p>
      <div className={c.block}>
        <CoolList
          items={[
            {
              title: "Находим файл hosts",
              content: (
                <>
                  <CopyBlock
                    command={"C:\\Windows\\System32\\drivers\\etc"}
                    text="Папка, где находится этот файл"
                  />
                </>
              ),
            },
            {
              title: "Редактируем",
              content: (
                <>
                  <ol>
                    <li>ПКМ по файлу</li>
                    <li>Нажимаем "Свойства"</li>
                    <li>Вкладка "Безопасность"</li>
                    <li>Нажимаем "Изменить"</li>
                    <li>
                      Проставляем галки "Разрешить" и нажимаем ОК и сохраняем
                    </li>
                  </ol>
                  <img src="/guide/hosts.webp" alt="" />
                  <ol>
                    <li>Далее, открываем файл hosts через блокнот</li>
                    <li>
                      Добавляем в конец эту строчку
                      <CopySomething
                        something={"0.0.0.0 www.dota2.com"}
                        placeholder={
                          <Input
                            value={"0.0.0.0 www.dota2.com"}
                            readOnly={true}
                          />
                        }
                      />
                    </li>
                  </ol>
                  <p>Должно получиться что-то вроде этого:</p>
                  <img src="/guide/hosts2.webp" alt="" />
                </>
              ),
            },
            {
              title: "Проверяем",
              content: (
                <>
                  <p>Проверим, что все получилось и клиент больше не лагает:</p>
                  <ol>
                    <li>Заходим в клиент игры 6.84</li>
                    <li>Вкладка "Сегодня"</li>
                    <li>
                      Если вместо веб страницы выдает пустую страницу с ошибкой
                      <span className="red">-105 / -107 / -108</span> - все
                      сделано правильно и производительность должна повыситься.
                    </li>
                  </ol>
                </>
              ),
            },
            {
              title: "Как вернуть все обратно",
              content: (
                <>
                  <p>
                    Если нужно зайти на сайт dota2.com или по другим причинам
                    хочешь вернуть, как было:
                  </p>
                  <ol>
                    <li>Открываем файл hosts</li>
                    <li>Убираем строку "0.0.0.0 www.dota2.com"</li>
                    <li>Сохраняем файл"</li>
                    <li>Теперь сайт снова доступен.</li>
                  </ol>
                </>
              ),
            },
          ]}
        />
      </div>

      <h2>netgraph</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              command={"net_graph 1"}
              text="Показать FPS, ping, потери пакетов"
            />
          </li>
          <li>
            <CopyBlock command={"net_graphpos 1"} text="Показывать справа" />
          </li>
          <li>
            <CopyBlock command={"net_graphpos 2"} text="Показывать по центру" />
          </li>
          <li>
            <CopyBlock command={"net_graphpos 3"} text="Показывать слева" />
          </li>
          <li>
            <CopyBlock
              command={"net_graphproportionalfont 1"}
              text="Увеличить шрифт"
            />
          </li>
        </ul>
      </div>

      <h2>Команды для повышения производительности</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              text={
                "Как часто обновляется игра при альтабе(полезно для стримов, значения от 0 до 20)"
              }
              command={"engine_no_focus_sleep 20"}
            />
          </li>
          <li>
            <CopyBlock
              text={"Асинхронное микширование звука"}
              command="snd_mix_async 1"
            />
          </li>
          <li>
            <CopyBlock text={"Мультипоток"} command="cl_threaded_init 1" />
          </li>
          <li>
            <CopyBlock
              text="Альтернативный рендер теней"
              command="r_shadow_deferred_simd 1"
            />
          </li>
          <li>
            <CopyBlock
              text="Альтернативная работа с 'костями'"
              command="cl_simdbones 1; cl_use_simd_bones 1"
            />
          </li>
        </ul>
      </div>

      <h2>Улучшаем отзывчивость</h2>
      <div className={c.block}>
        <p>Если у тебя пинг 40 и ниже, можно подкрутить интерполяцию</p>
        <CopyBlock text="Команда #1" command="сl_interp 0" />
        <CopyBlock text="Команда #2" command="cl_interp_ratio 1" />
        <p>
          Мониторим параметр <span className="gold">lerp</span> через netgraph
          5. Смотрим на цвет "lerp" и на табличку: мы хотим добиться, чтобы lerp
          был белого цвета!
        </p>
        <Table className="compact">
          <thead>
            <tr>
              <th>Показание lerp</th>
              <th>Консольная команда</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Красный</td>
              <td>
                <CopyBlock
                  text="cl_interp (0 - 0.05)"
                  command="cl_interp 0.033"
                />
              </td>
            </tr>
            <tr>
              <td>Желтый</td>
              <td>
                <CopyBlock text="" command="cl_interp 0.037" />
              </td>
            </tr>
            <tr>
              <td>Оранжевый</td>
              <td>
                <CopyBlock text="" command="cl_interp 0.039" />
              </td>
            </tr>
            <tr>
              <td>Все равно не белый?</td>
              <td>
                <CopyBlock text="" command="cl_interp_ratio 2" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
