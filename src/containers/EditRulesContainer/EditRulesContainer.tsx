import React, { useCallback, useRef } from "react";

import c from "./EditRulesContainer.module.scss";
import {
  RuleDto,
  RulePunishmentDto,
  RuleType,
  UpdateRuleIndexDto,
} from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import { MoveHandler, Tree, TreeApi } from "@dota2classic/react-arborist";
import { RuleNode } from "@/containers/EditRulesContainer/RuleNode";
import { getApi } from "@/api/hooks";
import { runInAction, toJS } from "mobx";
import {
  Button,
  Checkbox,
  Duration,
  Input,
  MarkdownTextarea,
  SelectOptions,
} from "@/components";
import { useAsyncButton } from "@/util/use-async-button";
import useResizeObserver from "use-resize-observer";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { IoMdCreate, IoMdSave } from "react-icons/io";
import { BsList, BsListNested } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";

interface IEditRulesContainerProps {
  rules?: RuleDto[];
  punishments?: RulePunishmentDto[];
}

type RuleDtoEditable = RuleDto & { dirty?: boolean };

export const EditRulesContainer: React.FC<IEditRulesContainerProps> = observer(
  ({ rules, punishments }) => {
    const treeRef = useRef<TreeApi<RuleDtoEditable> | null>(null);

    const state = useLocalObservable<{
      rules: RuleDtoEditable[];
      punishments: RulePunishmentDto[];
      editedRule?: RuleDtoEditable;
    }>(() => ({
      rules: rules || [],
      punishments: punishments || [],
      editedRule: undefined,
    }));

    const { ref, width, height } = useResizeObserver();

    const [updating, onUpdateRule] = useAsyncButton(async () => {
      if (!state.editedRule) return;
      await getApi().rules.ruleControllerUpdateRule(
        Number(state.editedRule.id),
        {
          description: state.editedRule.description,
          title: state.editedRule.title,
          punishmentId: state.editedRule.punishment?.id || null,
          automatic: state.editedRule.automatic,
          ruleType: state.editedRule.ruleType,
        },
      );
      const rules = await getApi().rules.ruleControllerGetAllRules();
      runInAction(() => {
        state.rules = rules;
      });
    }, [state]);

    const [creating, onCreate] = useAsyncButton(
      async (parentId?: number) => {
        const rule = await getApi().rules.ruleControllerCreateRule({
          parent: parentId,
        });
        const rules = await getApi().rules.ruleControllerGetAllRules();
        runInAction(() => {
          state.rules = rules;
          state.editedRule = rule;
        });
      },
      [state],
    );

    const [deleting, onDelete] = useAsyncButton(async () => {
      if (!state.editedRule) return;
      const response = await getApi().rules.ruleControllerDeleteRule(
        Number(state.editedRule.id),
      );
      makeSimpleToast("Удаление правила", response.message, 5000);
      const rules = await getApi().rules.ruleControllerGetAllRules();
      runInAction(() => {
        state.rules = rules;
        state.editedRule = undefined;
      });
    }, [state]);

    const [settingIndices, updateIndices] = useAsyncButton(async () => {
      const updateRules = (rules: RuleDto[]): UpdateRuleIndexDto[] => {
        return rules.flatMap((rule, index) => [
          { ruleId: Number(rule.id), index },
          ...updateRules(rule.children),
        ]);
      };

      const rules = await getApi().rules.ruleControllerUpdateIndices({
        updates: updateRules(state.rules),
      });

      runInAction(() => {
        state.rules = rules;
      });
    }, [state]);

    const onMove: MoveHandler<RuleDto> = useCallback(
      async (args) => {
        if (args.dragNodes.length !== 1) return;
        const node = args.dragNodes[0];

        const affectedNodes = args.parentNode
          ? [...args.parentNode.children!]
          : [...treeRef.current!.root.children!];

        const idx = affectedNodes.findIndex((t) => t.id === node.id);
        if (idx !== -1) {
          affectedNodes.splice(idx, 1);
        }

        affectedNodes.splice(args.index, 0, node);

        await getApi().rules.ruleControllerUpdateIndices({
          updates: affectedNodes.map((node, idx) => ({
            ruleId: Number(node.id),
            parent: args.parentId ? Number(args.parentId) : null,
            index: idx,
          })),
        });

        const rules = await getApi().rules.ruleControllerGetAllRules();
        runInAction(() => {
          state.rules = rules;
        });
      },
      [state],
    );

    const updateEditedRule = useCallback(
      (p: Partial<RuleDtoEditable>) => {
        runInAction(() => {
          if (!state.editedRule) return;
          Object.assign(state.editedRule, p);
          state.editedRule.dirty = true;
        });
      },
      [state.editedRule],
    );

    return (
      <div className={cx(c.container, NotoSans.className)}>
        <div className={c.tree}>
          <Button onClick={() => onCreate()} disabled={creating}>
            <IoMdCreate />
            Создать правило
          </Button>
          <Button onClick={updateIndices} disabled={settingIndices}>
            <GoListOrdered />
            Задать индексы
          </Button>
          <div ref={ref}>
            <Tree<RuleDto>
              width={width || 389}
              height={height}
              ref={treeRef}
              onSelect={(r) =>
                runInAction(
                  () =>
                    (state.editedRule = r.length
                      ? toJS(r[0].data as RuleDto)
                      : undefined),
                )
              }
              disableMultiSelection
              onMove={onMove as unknown as never}
              data={state.rules}
            >
              {RuleNode}
            </Tree>
          </div>
        </div>
        <div className={c.edit}>
          {state.editedRule && (
            <>
              <header>Правило</header>
              <Input
                placeholder={"Правило"}
                value={state.editedRule.title}
                onChange={(e) => updateEditedRule({ title: e.target.value })}
              />
              <header>Описание правила</header>
              <MarkdownTextarea
                rows={12}
                value={state.editedRule.description}
                onChange={(e) =>
                  updateEditedRule({ description: e.target.value })
                }
                placeholder={"Описание правила"}
              />

              <header>Наказание</header>
              <SelectOptions
                defaultText={"Наказание"}
                options={[
                  {
                    label: "Убрать наказание",
                    value: undefined,
                  },
                  ...state.punishments.map((punishment) => ({
                    label: (
                      <>
                        {punishment.title}:{" "}
                        <Duration
                          long
                          duration={punishment.durationHours * 60 * 60}
                        />
                      </>
                    ),
                    value: punishment.id,
                  })),
                ]}
                selected={state.editedRule.punishment?.id}
                onSelect={(p: { value: number; label: string } | undefined) => {
                  updateEditedRule({
                    punishment: state.punishments.find(
                      (t) => t.id === p?.value,
                    ),
                  });
                }}
              />

              <header>Тип правила</header>
              <SelectOptions
                defaultText={"Тип правила"}
                options={[
                  {
                    value: RuleType.COMMUNICATION,
                    label: "Коммуникации",
                  },
                  {
                    value: RuleType.GAMEPLAY,
                    label: "Геймплей",
                  },
                ]}
                selected={state.editedRule.ruleType}
                onSelect={(
                  p: { value: RuleType; label: string } | undefined,
                ) => {
                  updateEditedRule({
                    ruleType: p!.value,
                  });
                }}
              />

              <header>Флаги</header>
              <Checkbox
                onChange={(e) => updateEditedRule({ automatic: e })}
                checked={state.editedRule.automatic}
              >
                Обрабатывается автоматически
              </Checkbox>

              <div className={c.buttons}>
                <Button
                  disabled={!state?.editedRule?.dirty || updating}
                  onClick={() => {
                    onUpdateRule().then(() =>
                      runInAction(() => {
                        if (state.editedRule) {
                          state.editedRule.dirty = false;
                        }
                      }),
                    );
                  }}
                >
                  {state.editedRule.dirty && <IoMdSave className="gold" />}{" "}
                  Сохранить правило
                </Button>
                <Button disabled={deleting} onClick={() => onDelete()}>
                  <MdDelete />
                  Удалить правило из базы
                </Button>

                <Button
                  disabled={creating}
                  onClick={() => onCreate(Number(state.editedRule!.id))}
                >
                  <BsListNested />
                  Создать дочернее правило
                </Button>
                <Button
                  disabled={creating}
                  onClick={() => onCreate(Number(state.editedRule!.parentId))}
                >
                  <BsList />
                  Создать соседнее правило
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);
