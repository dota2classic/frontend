export function formatWinrate(wins: number, loss: number) {
  const total = wins + loss;

  return ((100 * wins) / Math.max(1, total)).toFixed(2) + "%";
}

export function winrate(wins: number, loss: number) {
  const total = wins + loss;

  return wins / Math.max(1, total);
}

export function remapNumber(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number,
) {
  return low2 + ((value - low1) * (high2 - low2)) / (high1 - low1);
}

export function expectedSuccessfulRolls(
  P: number, // базовый шанс выпадения предмета
  Y: number, // понижающий коэффициент
  maxPlayers: number = 10, // максимум игроков
): number {
  let totalExpectedItems = 0;

  for (let players = 1; players <= maxPlayers; players++) {
    let expectedItemsForPlayers = 0;
    let chance = P;

    for (let i = 0; i < players; i++) {
      // Вероятность того, что игрок получит предмет именно на этой попытке:
      // это вероятность того, что он не получил ранее (1 - сумма предыдущих вероятностей),
      // умноженная на текущий шанс.
      const probGetItemThisAttempt = chance;

      // Добавляем к ожидаемому количеству:
      expectedItemsForPlayers += probGetItemThisAttempt;

      // Обновляем шанс для следующей попытки:
      chance *= Y;

      // Если шанс стал очень маленьким, можно прервать цикл для оптимизации,
      // но это не обязательно.
    }

    totalExpectedItems += expectedItemsForPlayers;
  }

  // Среднее по количеству игроков
  return totalExpectedItems / maxPlayers;
}

// Пример использования:
// const averageItems = calculateAverageItems(0.2, 0.9);
// console.log(`Среднее количество предметов: ${averageItems.toFixed(2)}`);
