import React, { useCallback, useRef } from "react";

import c from "./EditRulesContainer.module.scss";
import { RuleDto, UpdateRuleIndexDto } from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Tree, TreeApi, MoveHandler } from "@dota2classic/react-arborist";
import { RuleNode } from "@/containers/EditRulesContainer/RuleNode";
import { getApi } from "@/api/hooks";
import { runInAction, toJS } from "mobx";
import { Button, MarkdownTextarea } from "@/components";
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
}

type RuleDtoEditable = RuleDto & { dirty?: boolean };

export const EditRulesContainer: React.FC<IEditRulesContainerProps> = observer(
  ({ rules }) => {
    const treeRef = useRef<TreeApi<RuleDtoEditable> | null>(null);

    const state = useLocalObservable<{
      rules: RuleDtoEditable[];
      editedRule?: RuleDtoEditable;
    }>(() => ({
      rules: rules || [],
      editedRule: undefined,
    }));

    const { ref, width, height } = useResizeObserver();

    const [updating, onUpdateRule] = useAsyncButton(async () => {
      if (!state.editedRule) return;
      await getApi().rules.ruleControllerUpdateRule(
        Number(state.editedRule.id),
        {
          description: state.editedRule.description,
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
        console.log(args);
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

    return (
      <div className={cx(c.container, NotoSans.className)}>
        <div className={c.tree}>
          <Button onClick={onCreate} disabled={creating}>
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
              <MarkdownTextarea
                rows={12}
                value={state.editedRule.description}
                onChange={(e) => {
                  runInAction(() => {
                    if (!state.editedRule) return;
                    state.editedRule.description = e.target.value;
                    state.editedRule.dirty = true;
                  });
                }}
                placeholder={"Текст правила"}
              />

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
