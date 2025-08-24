import { EmbedProps } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { TrajanPro } from "@/const/fonts";

export default function VacanciesPage() {
  return (
    <>
      <EmbedProps
        title="Кто нам нужен"
        description="В каких талантах нуждается проект dotaclassic"
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h1 className={cx(TrajanPro.className, "megaheading")}>
          Кто нам нужен
        </h1>
        <p>
          Проект <span className="red">dotaclassic</span> держится на энтузиазме
          людей, для которых старая дота больше, чем просто "кастомка". Мы
          принимаем любую помощь, но, к сожалению, безвозмездно - проект
          некоммерческий и вся прибыль идет на развитие.
        </p>
        <p>
          Все "вакансии" подразумевают отсутствие денежного вознаграждение, но
          при этом от кандидата не ожидается запредельного импакта.
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Продакт менеджер
        </h2>
        <p>
          Нашему проекту очень нужен человек, который будет направлять развитие
          продукта. У нас есть ресурсы разработки, немного аналитики, но мы
          слишком мало времени уделяем работе с пользователями и развиваемся в
          "примерном" направлении.
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Контент менеджер
        </h2>
        <p>
          У нас есть телеграм канал, дискорд сервер, тикток и ютуб - но контента
          в нем совсем немного и он не поставлен на поток. Разрабатывать
          контент-план, регулярно постить в каналы - на все это нам просто не
          хватает рук.
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Продакт аналитик
        </h2>
        <p>
          У нас есть платформа для метрик и постройки аналитики, но не хватает
          профессионализма. Составление аналитических запросов, построение
          продуктовых дашбордов в grafana, и самое главное - понимать поведение
          пользователей и выдвигать гипотезы.
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Фронтенд разработчик React/Vue
        </h2>
        <p>
          Основной сайт написан на NextJS, но некоторые компоненты(например,
          превью предметов) написаны на Vue. Много интересных фичей ждет
          разработки, а также рефакторинг существующей кодовой базы.
        </p>
        <p>Ожидаемые навыки и инструменты:</p>
        <ul>
          <li>React, Typescript</li>
          <li>SASS/SCSS</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>UI дизайнер</h2>
        <p>
          У сайта есть "зародыш" стиля, но не хватает общей дизайн системы и
          структуры. Опытный дизайнер поможет нам прийти к однообразию,
          визуальной стабильности и удобству пользования.
        </p>
        <p>Ожидаемые навыки и инструменты:</p>
        <ul>
          <li>Построение макетов и систем компонентов</li>
          <li>Figma</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Devops и системный администратор
        </h2>
        <p>
          Поддержка и администрация тачек, где у нас в docker-compose крутятся
          сервисы и nginx. Также у нас есть "игровые" тачки - на них хостятся
          сервера. Из них нужно уметь выжимать максимум перфоманса.
        </p>
        <p>Ожидаемые навыки и инструменты:</p>
        <ul>
          <li>OS Linux, Bash</li>
          <li>Docker, Docker-Compose</li>
          <li>Nginx</li>
          <li>VPN</li>
          <li>Ansible</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Бекенд разработчик NodeJS/Typescript
        </h2>
        <p>
          Бекенд в основном состоит из NestJS сервисов, общающихся по Rest,
          RabbitMQ и Redis. Основные задачи - реализовывать новые фичи в
          существующих сервисах, реализовывать новые сервисы, написание и
          поддержка интеграционных и юнит тестов.
        </p>
        <p>Ожидаемые навыки и инструменты:</p>
        <ul>
          <li>NodeJS, Typescript</li>
          <li>NestJS/Express/Koa</li>
          <li>PostgreSQL, Typeorm</li>
          <li>Jest</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          SRCDS модер/разработчик плагинов
        </h2>
        <p>
          Очень специфическая работа - разработка и поддержка существующих
          sourcemod плагинов, настройка конфигов и работа с другими source
          инструментами - hammer и прочие
        </p>
        <p>Ожидаемые навыки и инструменты:</p>
        <ul>
          <li>Sourcepawn</li>
          <li>Lua</li>
          <li>Hammer</li>
          <li>Metamod</li>
          <li>Sourcemod</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Discord модератор/настройка сервера
        </h2>
        <p>
          Мы с радостью примем помощь в настройке дискорд сервера, чтобы им было
          и удобно пользоваться, новичкам была легко доступна важная информация,
          а модераторам легко было поддерживать порядок.
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          Как с нами связаться
        </h2>
        <p>
          <a className={"link"} href="https://t.me/enchantinggg4">
            t.me/enchantinggg4
          </a>{" "}
          - пиши мне в телеграм. Пожалуйста, указывай, что именно тебя
          заинтересовало, а также расскажи про свой опыт - мне будет очень
          интересно!
        </p>
      </div>
    </>
  );
}
