import React, { useCallback } from "react";
import { DropSettingsDto, DropTierDto, UpdateDropTierDto } from "@/api/back";
import { Button, Input, Table } from "@/components";
import { observer, useLocalObservable } from "mobx-react-lite";
import { computed, runInAction } from "mobx";
import { getApi } from "@/api/hooks";
import { expectedSuccessfulRolls } from "@/util/math";

interface IEditDropSettingsProps {
  tiers: DropTierDto[];
  settings: DropSettingsDto;
}

export const EditDropSettings: React.FC<IEditDropSettingsProps> = observer(
  ({ tiers, settings }) => {
    const data = useLocalObservable(() => ({
      tiers,
      settings,
    }));

    const sortedTiers = computed(() =>
      [...data.tiers].sort((a, b) => a.minPrice - b.minPrice),
    ).get();

    const averagePricePerMatch = computed(() => {
      const totalWeight = data.tiers.reduce((a, b) => a + b.weight, 0);
      let pricePerDrop = 0;
      for (const tier of data.tiers) {
        pricePerDrop +=
          (((tier.maxPrice + tier.minPrice) / 2) * tier.weight) / totalWeight;
      }

      const averageDropsPerMatch = expectedSuccessfulRolls(
        data.settings.baseDropChance,
        data.settings.subsequentDropChance,
      );

      console.log(
        averageDropsPerMatch,
        data.settings.baseDropChance,
        data.settings.subsequentDropChance,
      );

      return pricePerDrop * averageDropsPerMatch;
    }).get();

    const updateTierData = useCallback(
      async (id: number, dto: UpdateDropTierDto) => {
        const tier = data.tiers.find((t) => t.id === id);
        if (!tier) return;

        runInAction(() => {
          Object.assign(tier, dto);
        });
      },
      [],
    );

    const saveTiers = useCallback(async () => {
      await Promise.all(
        data.tiers.map((tier) =>
          getApi().drops.itemDropControllerUpdateTier(tier.id, tier),
        ),
      );

      await getApi().drops.itemDropControllerUpdateSettings(data.settings);

      await getApi()
        .drops.itemDropControllerGetDropTiers()
        .then((tiers) => runInAction(() => (data.tiers = tiers)));
    }, [data.tiers]);

    const createTier = useCallback(async () => {
      await getApi().drops.itemDropControllerCreateDropTier({
        minPrice: -100,
        maxPrice: -50,
        weight: 500,
      });

      await getApi()
        .drops.itemDropControllerGetDropTiers()
        .then((tiers) => runInAction(() => (data.tiers = tiers)));
    }, [data.tiers]);

    const deleteTier = useCallback(
      async (id: number) => {
        await getApi().drops.itemDropControllerDeleteTier(id);
        await getApi()
          .drops.itemDropControllerGetDropTiers()
          .then((tiers) => runInAction(() => (data.tiers = tiers)));
      },
      [data.tiers],
    );

    return (
      <>
        <Button onClick={createTier}>Новый тир</Button>
        <Button onClick={saveTiers}>Сохранить</Button>
        <Table>
          <thead>
            <tr>
              <th>Базовый шанс</th>
              <th>Понижающий коэффициент</th>
              <th>Желаемый инвентарь</th>
              <th>Стоиомость 1 матча</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input
                  type="number"
                  step="0.05"
                  min="0.05"
                  max="1"
                  value={data.settings.baseDropChance}
                  onChange={(e) =>
                    runInAction(() => {
                      data.settings.baseDropChance = Number(e.target.value);
                    })
                  }
                />
              </td>
              <td>
                <Input
                  type="number"
                  step="0.05"
                  min="0.05"
                  max="0.95"
                  value={data.settings.subsequentDropChance}
                  onChange={(e) =>
                    runInAction(() => {
                      data.settings.subsequentDropChance = Number(
                        e.target.value,
                      );
                    })
                  }
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={data.settings.desiredStock}
                  onChange={(e) =>
                    runInAction(() => {
                      data.settings.desiredStock = Number(e.target.value);
                    })
                  }
                />
              </td>
              <td>{Math.ceil(averagePricePerMatch)}</td>
            </tr>
          </tbody>
        </Table>
        <Table>
          <thead>
            <tr>
              <th>Мин цена</th>
              <th>Макс цена</th>
              <th>Вес</th>
              <th>Шанс выпадения</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedTiers.map((tier) => (
              <tr key={tier.id}>
                <td>
                  <Input
                    value={tier.minPrice}
                    placeholder="min price"
                    onChange={(e) =>
                      updateTierData(tier.id, {
                        minPrice: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <Input
                    value={tier.maxPrice}
                    placeholder="max price"
                    onChange={(e) =>
                      updateTierData(tier.id, {
                        maxPrice: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <Input
                    value={tier.weight}
                    placeholder="min price"
                    onChange={(e) =>
                      updateTierData(tier.id, {
                        weight: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  1 в{" "}
                  {1 /
                    (tier.weight /
                      sortedTiers.reduce((a, b) => a + b.weight, 0))}{" "}
                  игр
                </td>
                <td>
                  <Button onClick={() => deleteTier(tier.id)}>Удалить</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  },
);
