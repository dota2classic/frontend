import { GenericTable, PageLink } from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { AppRouter } from "@/route";

export default function DownloadPage() {
  return (
    <>
      <h2>Как начать играть?</h2>
      <ol>
        <li>
          Скачай клиент игры (windows), используя таблицу. Если ты играешь на
          Windows, переходи к шагу 3.
        </li>
        <li>
          Если ты играешь на Linux или MacOS, так же дополнительно скачай файлы
          для своей плафтормы из той же таблицы.
        </li>
        <li>Извлеки архив с игрой в удобное для себя место</li>
        <li>Убедись, что у тебя запущен Steam</li>
        <li>Зайди в папку с игрой и запусти dota.exe</li>
        <li>
          Убедившись, что у тебя работает клиент и ты разобрался с управлением в
          игре с ботами, переходи в{" "}
          <PageLink link={AppRouter.queue.link}>поиск игры</PageLink>
        </li>
      </ol>
      <GenericTable
        isLoading={false}
        keyProvider={(it) => it[0]}
        placeholderRows={9}
        columns={[
          {
            type: ColumnType.ExternalLink,
            name: "Google диск",
          },
          {
            type: ColumnType.ExternalLink,
            name: "Media fire",
          },
          {
            type: ColumnType.ExternalLink,
            name: "Mega",
          },
          {
            type: ColumnType.ExternalLink,
            name: "Яндекс Диск",
          },
        ]}
        data={[
          [
            {
              link: "https://drive.google.com/file/d/13wnnUYpUeYP7PJQ1dSZpS8W-CTCjati6/view?usp=sharing",
              label: "Windows + base game",
            },
            {
              link: "https://www.mediafire.com/file/37a334itg8iv6zz/Dota_2_6.84_Source_1_%25281504%2529.7z/file",
              label: "Windows + base game",
            },
            {
              link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
              label: "Windows + base game",
            },
            {
              link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
              label: "Windows + base game todo",
            },
          ],

          [
            {
              link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
              label: "Linux binaries",
            },
            {
              link: "https://www.mediafire.com/file/box3btsn4ttiz1o/Dota_2_6.84_Source_1_Linux.tar.gz/file",
              label: "Linux binaries",
            },
            {
              link: "https://mega.nz/file/YHZnjDKa#1Ra6lgjxseBYMlXAelZABazEx_ZIbvbPPJOYcM6gNO4",
              label: "Linux binaries",
            },
            {
              link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
              label: "Linux binaries todo",
            },
          ],

          [
            {
              link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
              label: "MacOS binaries",
            },
            {
              link: "https://www.mediafire.com/file/v1rdgopyjo5s8b1/Dota_2_6.84_Source_1_Mac.tar.gz/file",
              label: "MacOS binaries",
            },
            {
              link: "https://mega.nz/file/YHZnjDKa#1Ra6lgjxseBYMlXAelZABazEx_ZIbvbPPJOYcM6gNO4",
              label: "MacOS binaries",
            },
            {
              link: "https://mega.nz/file/Ea5HURST#GeBiVze4vrv5VPyeM55pYJs8C_ItkmEB2z0xE7uiDHY",
              label: "MacOS binaries todo",
            },
          ],
        ]}
      />
    </>
  );
}
