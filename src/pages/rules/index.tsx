import c from "./RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { EmbedProps } from "@/components";

export default function RulesPage() {
  return (
    <>
      <EmbedProps
        title="Правила пользования сервисом"
        description="Правила, которые мы выставляем для поведения и игры на нашем проекте."
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h1 id="-">
          <strong className="editor-text-bold">Правила</strong>
        </h1>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            Проект Dota 2 Classic – является сообществом ценителей классической
            доты.
          </strong>{" "}
          Ежедневно его посещает множество людей в поисках старой версии любимой
          игры.{" "}
          <strong className="editor-text-bold">
            Стоит помнить, что это – наш общий дом, пребывание в котором должно
            быть комфортным для каждого.
          </strong>
        </p>
        <h3 className="editor-heading-h2">
          <strong className="editor-text-bold">Раздел 1. Геймплей</strong>
        </h3>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>1.1.</span> Общие положения
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.1.1</span>. Каждый игрок на сервере должен
          соблюдать принципы честной игры{" "}
          <strong className="editor-text-bold">(«fair play»).</strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.1.2</span>. Запрещены любые действия,
          нарушающие игровой баланс, создающие угрозу честной конкуренции и
          мешающие другим игрокам получать удовольствие от игры.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>1.2.</span> Спортивное поведение
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.1</span>.{" "}
          <strong className="editor-text-bold">
            Умышленное саботирование игры («руин»)
          </strong>
          , то есть преднамеренные действия, направленные на проигрыш своей
          команды (например, намеренный{" "}
          <strong className="editor-text-bold">«фид»</strong>), категорически
          запрещено.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.2</span>. Преждевременное завершение или
          искусственное затягивание матча запрещено.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.3</span>. Любые формы травли других
          игроков запрещены.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            Примерный список потенциальных умышленных нарушений:
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.4</span>. Совершение действий,
          направленных на предоставление преимущества противнику, включая:
        </p>
        <ul>
          <li>неоднократную (два раза и более) смерть героя в игре;</li>
          <li>
            однократную смерть, непосредственно сопровождаемую выходом из игры{" "}
            <strong className="editor-text-bold">(«лив»)</strong>.
          </li>
        </ul>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.5</span>. Передача предметов в пользу
          команды противника.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.6</span>. Предоставление игровой
          информации противнику, наносящее ущерб своим союзникам.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.7</span>. Уничтожение, продажа своих
          артефактов либо уничтожение и кража предметов союзников, а также любые
          действия, приводящие к потере или ухудшению их функциональности.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.8</span>. Закупка предметов, не
          соответствующих игровой ситуации, в ущерб интересам своей команды.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.9</span>. Использование способностей
          героя, эффектов предметов или игровых механик против собственных
          союзников, включая:
        </p>
        <ul>
          <li>
            неоднократные (три и более раза) действия, в результате которых
            нанесен вред союзникам или существенно ухудшилось их положение;
          </li>
          <li>однократные действия, если они привели к смерти союзника.</li>
        </ul>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.10</span> Намеренное бездействие{" "}
          <strong className="editor-text-bold">(«AFK»)</strong> на протяжении
          значительного времени, определяемого как нахождение вне игрового
          процесса более 10 минут.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.11</span> Поведение, мешающее
          информационному взаимодействию команды, включая чрезмерные действия,
          такие как:
        </p>
        <ul>
          <li>мигание по мини-карте;</li>
          <li>
            постоянное использование паузы в игре без объективной необходимости.
          </li>
        </ul>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.12.</span> Передача победы запрещена.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.13.</span> Запрещены постоянные действия,
          демонстрирующие нежелание взаимодействовать с командой.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.14.</span> Запрещено внедрение в
          командное взаимодействие с целью «троллинга».
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.15.</span>{" "}
          <strong className="editor-text-bold">
            Непреднамеренный крайне низкий уровень игры
          </strong>{" "}
          <strong className="editor-text-bold">(«лоускилл»),</strong>{" "}
          причиняющий экстремальный ущерб игровому процессу и другим участникам,
          наказывается{" "}
          <strong className="editor-text-bold">
            перманентной блокировкой аккаунта
          </strong>
          .
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.16.1.</span>
          <span className={c.part}></span> В частности, наличие хотя бы одного
          из нижеследующих критериев (метрик) за 50 игр подтверждает крайне
          низкий уровень игры:
          <br />
        </p>
        <ul>
          <li>Общий процент побед («винрейт») ниже 40%</li>
          <li>
            Коэффициент KDA ниже <span className={c.part}>1</span>
          </li>
        </ul>
        <p className="editor-paragraph">
          Такие случаи стоит расценивать как неспособность сервиса подобрать
          соответствующих по мастерству соперников.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.16.2.</span>
          <span className={c.part}></span> Дополнительно, при вынесении вердикта
          учитываются следующие показатели:
        </p>
        <ul>
          <li>незнание базовых игровых механик;</li>
          <li>
            отсутствие прогресса или крайне низкий уровень улучшений в
            мастерстве игры за значительный период;
          </li>
          <li>
            иные показатели игровой статистики, отклоняющиеся от минимально
            допустимых.
          </li>
        </ul>
        <p className="editor-paragraph">
          <span className={c.part}>1.2.17.</span> Пользователи обязаны честно
          завершать свои игровые сессии и не инициировать рестарты{" "}
          <strong className="editor-text-bold">
            (перезапуски игры / «додж»)
          </strong>{" "}
          искусственно.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">Важно:</strong> этот список не
          является исчерпывающими - мы оставляем за собой право определять,
          какое поведение считается нарушением наших правил в каждой конкретной
          ситуации.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>1.3.</span> Коммуникация в чате
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.3.1</span>. Запрещены: агрессия,
          дискриминация, клевета и другие нарушения культуры общения с
          остальными игроками{" "}
          <strong className="editor-text-bold">(«токсичность»)</strong>.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.3.2</span>. Флуд или спам в игровой чат
          недопустимы.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.3.3</span>. Распространение сообщений,
          содержащих несогласованную рекламу, не относящуюся к проекту,
          наказывается баном.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>1.4.</span> Запрет на мультоводство
            (смурфинг) и передачу аккаунтов
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.4.1</span>. Использование нескольких
          аккаунтов (мультоводство / смурфинг) запрещено.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.4.2</span>. Передача доступа к своему
          аккаунту другим лицам запрещена.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>1.4.3</span>. В случае утраты доступа к
          основному аккаунту пользователь имеет право зарегистрировать новый
          аккаунт на сайте сообщества только с предварительного одобрения
          администрации.
        </p>
        <h3 className="editor-heading-h2">
          <strong className="editor-text-bold">Раздел 2. Правила форума</strong>
        </h3>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>2.1.</span> Общие принципы использования
            форума
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>2.1.1</span>. Участники форума обязаны
          сохранять атмосферу уважения и вежливости при общении.
          <br />
          <span className={c.part}>2.1.2</span>. Оффтопик в тематических
          разделах недопустим.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>2.2.</span> Оскорбления и провокации
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>2.2.1</span>. Любые формы оскорблений других
          участников (включая намёки и пассивно-агрессивное выражение)
          запрещены.
          <br />
          <strong className="editor-text-bold">
            <span className={c.part}>2.3.</span> Спам и реклама
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>2.3.1</span>. Использование форума для
          рекламы (прямой или скрытой) без согласия администрации запрещено.
          <br />
          <span className={c.part}>2.3.2</span>. Многократная публикация
          идентичных сообщений, независимо от цели, является нарушением правил
          сообщества.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>2.4.</span> Запрещенный контент
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>2.4.1</span>. На форуме категорически
          распространение материалов, нарушающих действующее законодательство.
        </p>
        <h3 className="editor-heading-h2">
          <strong className="editor-text-bold">
            Раздел 3. Ответственность
          </strong>
        </h3>
        <p className="editor-paragraph">
          <span className={c.part}>3.1.1</span>. Любой пользователь, нарушивший
          данные правила, может быть подвергнут дисциплинарным мерам, таким как:
        </p>
        <ul>
          <li>устное предупреждение или официальное замечание;</li>
          <li>
            временное ограничение участия в сообществе (игровом процессе или
            форуме);
          </li>
          <li>полная блокировка учётной записи (перманентный бан).</li>
        </ul>
        <p className="editor-paragraph">
          <span className={c.part}>3.2.</span> Любое нарушение рассматривается
          на усмотрение администрации. В случае спорных моментов участник имеет
          право обратиться с апелляцией.
        </p>
        <h3 className="editor-heading-h2">
          <strong className="editor-text-bold">
            Раздел 4. Порядок разрешения конфликтных ситуаций
          </strong>
        </h3>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>4.1.</span> Жалобы на игроков
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>4.1.1</span>. Каждый участник сообщества
          имеет право подать жалобу на другого игрока.
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>4.1.2</span>. Жалоба должна содержать:
        </p>
        <ul>
          <li>описание нарушения;</li>
          <li>доказательства нарушения;</li>
          <li>дата и время происшествия (ссылка на матч).</li>
        </ul>
        <h3 className="editor-heading-h2">
          <strong className="editor-text-bold">
            Раздел 5. Пользовательские соглашения и обязанности
          </strong>
        </h3>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>5.1.</span> Согласие с правилами
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>5.1.1</span>. Использование принадлежащих
          сообществу площадок означает автоматическое согласие пользователя с
          настоящими правилами. Соблюдение правил обязательно в равной мере вне
          зависимости от статуса, принадлежности к группам (игроки, модераторы и
          т. п.) и времени регистрации.
        </p>
        <p className="editor-paragraph">
          <strong className="editor-text-bold">
            <span className={c.part}>5.2.</span> Ответственность пользователей
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>5.2.1</span>. Каждый пользователь несёт
          личную ответственность за свои действия в игре и на платформах,
          принадлежащих сообществу.
          <br />
          <strong className="editor-text-bold">
            <span className={c.part}>5.3.</span> Конфиденциальность и защита
            данных
          </strong>
        </p>
        <p className="editor-paragraph">
          <span className={c.part}>5.3.1</span>. Публикация личной информации
          других участников сообщества без их согласия запрещена.
          <br />
          <span className={c.part}>5.3.2</span>. Администрация обязуется
          использовать данные пользователей исключительно для нужд сообщества
          (например, при разбирательствах или для статистики) и защищать их от
          утечек.
        </p>
      </div>
    </>
  );
}
