import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import c from "@/pages/static/Static.module.scss";
import React from "react";
import { TechStaticTabs } from "@/containers";
import { CopyBlock, EmbedProps } from "@/components";

export default function CommandsTechTab() {
  return (
    <div className={cx(NotoSans.className, c.container)}>
      <EmbedProps
        title="Настройка клиента Dota 2 6.84"
        description="Настройки старого клиента Dota 2 6.84. Отдаление камеры, полезные команды и другое."
      />
      <TechStaticTabs />
      <h1>Настройка клиента</h1>

      <h2>Полезные консольные команды</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              text="Задать верхнюю границу FPS (fps_max 0 если ограничение нужно убрать совсем)"
              command="fps_max 360"
            />
          </li>
          <li>
            <CopyBlock
              text="Не возвращать камеру на базу при возрождении"
              command="dota_reset_camera_on_spawn 0"
            />
          </li>
          <li>
            <CopyBlock
              text="Отключение тряски экрана"
              command="dota_screen_shake 0"
            />
          </li>
          <li>
            <CopyBlock
              text="Скоорость камеры(по умолчанию 3000)"
              command="dota_camera_speed 3000"
            />
          </li>
          <li>
            <CopyBlock
              text="Ускорение камеры(по умолчанию 49)"
              command="dota_camera_accelerate 49"
            />
          </li>

          <li>
            <CopyBlock
              text="Отключить приближение камеры"
              command="dota_camera_disable_zoom 1"
            />
          </li>
          <li>
            <CopyBlock
              text="Добивание союзных крипов на ПКМ"
              command="dota_force_right_click_attack 1"
            />
          </li>
          <li>
            <CopyBlock
              text="Автоматический повтор нажатия ПКМ"
              command="dota_player_auto_repeat_right_mouse 1"
            />
          </li>
          <li>
            <CopyBlock
              text="Отключить задержку клика по мини-карте"
              command="dota_minimap_misclick_time 0"
            />
          </li>
          <li>
            <CopyBlock
              text="Увеличение иконок героев на мини-карте"
              command="dota_minimap_hero_size 1000"
            />
          </li>
          <li>
            <CopyBlock
              text="Быстрая атака"
              command={`"bind "a" "mc_attack; +sixense_left_click; -sixense_left_click"`}
            />
          </li>
          <li>
            <CopyBlock
              text="Идти в направлении"
              command={`dota_unit_allow_moveto_direction 1, bind alt +dota_unit_movetodirection`}
            />
          </li>
          <li>
            <CopyBlock
              text="Дальность умений"
              command={`dota_disable_range_finder 0`}
            />
          </li>
        </ul>
      </div>

      <h2>Отдаление камеры</h2>
      <div className={c.block}>
        <ol>
          <li>
            Находим файл{" "}
            <span className="gold">Dota 6.84/dota/bin/client.dll</span>
          </li>
          <li>
            Делаем копию этого файла на всякий случай, если где-то ошибемся -
            всегда можно будет вернуть оригинальную версию
          </li>
          <li>
            Открываем его с помощью Notepad++ или другого текстового
            редактора/декомпилятора
          </li>
          <li>
            Ищем <span className="gold">1134</span> - это стандартная высота
            камеры. <span className="gold">ВАЖНО!</span> Нам нужно 2 значение в
            поиске: рядом с ним будет{" "}
            <span className="shit">dota_camera_pitch_max</span>
          </li>
          <li>
            Меняем на нужную дистанцию(до 1400) и сохраняем. Мы рекомендуем
            высоту камеры 1285 для тех, кому очень непривычно
          </li>
          <li>
            Сохраняем файл, перезапускаем клиент - высота камеры должна
            измениться
          </li>
          <li>
            Вот готовый файл{" "}
            <a href="https://disk.yandex.ru/d/re1lVyKCeoXx-Q" className="link">
              client.dll
            </a>{" "}
            с установленой высотой 1285. Файл нужно заменить в папке с игрой
          </li>
        </ol>
      </div>

      <h2>Быстрое применение(квик касты) и применение на себя через ALT</h2>
      <div className={c.block}>
        <ol>
          <li>
            Поставить галочку на функцию "применения на себя двойным нажатием"
            <img src="/guide/quick3.webp" alt="" />
          </li>
          <li>
            Во вкладке "Применение" устанавливаем "Клавишка + ALT",
            переключаемся на "Быстрое(квикасты)" и устанавливаем ту же клавишу
          </li>
          <img src="/guide/quick1.webp" alt="" />
          <img src="/guide/quick2.webp" alt="" />
          <li>
            <CopyBlock
              text="Эта консольная команда ускоряет применение двойного нажатия на себя через альт(ниже 0.2 не ставить!)"
              command="dota_ability_self_cast_timeout 0.2"
            />
          </li>
        </ol>
      </div>

      <h2>Подсветка юнитов</h2>
      <div className={c.block}>
        <p>
          Для выбора цветов можно использовать{" "}
          <a href="https://rgbcolorpicker.com/0-1">rgbcolorpicker.com</a>
        </p>
        <h3>Для своей команды</h3>
        <ol>
          <li>
            <CopyBlock
              text="Красный цвет"
              command="dota_friendly_color_r 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text="Зеленый цвет"
              command="dota_friendly_color_g 0.5"
            />
          </li>
          <li>
            <CopyBlock text="Синий цвет" command="dota_friendly_color_b 0.5" />
          </li>
        </ol>
        <h3>Для вражеской команды</h3>
        <ol>
          <li>
            <CopyBlock text="Красный цвет" command="dota_enemy_color_r 0.5" />
          </li>
          <li>
            <CopyBlock text="Зеленый цвет" command="dota_enemy_color_g 0.5" />
          </li>
          <li>
            <CopyBlock text="Синий цвет" command="dota_enemy_color_b 0.5" />
          </li>
        </ol>
        <h3>Нейтралы</h3>
        <ol>
          <li>
            <CopyBlock text="Красный цвет" command="dota_neutral_color_r 0.5" />
          </li>
          <li>
            <CopyBlock text="Зеленый цвет" command="dota_neutral_color_g 0.5" />
          </li>
          <li>
            <CopyBlock text="Синий цвет" command="dota_neutral_color_b 0.5" />
          </li>
        </ol>
      </div>
    </div>
  );
}
