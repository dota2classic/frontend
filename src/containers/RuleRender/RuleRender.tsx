import React from "react";

import c from "./RuleRender.module.scss";
import { RuleDto, RuleType } from "@/api/back";
import { FaHashtag } from "react-icons/fa";
import { Duration } from "@/components/Duration";
import cx from "clsx";

interface IRuleRenderProps {
  rule: RuleDto;
  parentIndexPrefix?: string;
}

export const RuleRender: React.FC<IRuleRenderProps> = ({
  rule,
  parentIndexPrefix,
}) => {
  const fullIndex = `${parentIndexPrefix ? `${parentIndexPrefix}.` : ""}${rule.index + 1}`;
  const ruleId = `${rule.id}`;

  const rest = rule.children.map((childRule) => (
    <RuleRender
      key={childRule.id}
      rule={childRule}
      parentIndexPrefix={fullIndex}
    />
  ));

  const ReferenceButton = (
    <a href={`#${ruleId}`} className={c.hashtag}>
      <FaHashtag />
    </a>
  );

  const Description = rule.description ? (
    <p className={c.description}>{rule.description}</p>
  ) : null;

  const Automatic = rule.automatic ? (
    <p className={cx(c.description, "bronze")}>
      Правило обрабатывается автоматически
    </p>
  ) : null;

  const Punishment = rule.punishment ? (
    <span className={c.punishment}>
      Наказание:{" "}
      <Duration duration={rule.punishment.durationHours * 60 * 60} long />
      {", "}
      {rule.ruleType === RuleType.COMMUNICATION
        ? "запрет коммуникаций"
        : "запрет поиска"}
    </span>
  ) : null;

  if (!parentIndexPrefix) {
    return (
      <>
        <h2 id={ruleId} className={c.hashtagable}>
          {ReferenceButton}
          Раздел <span className={c.part}>{fullIndex}</span>. {rule.title}
        </h2>
        {Automatic}
        {Description}
        {Punishment}
        {rest}
      </>
    );
  }

  if (!rule.children?.length) {
    return (
      <>
        <p id={ruleId} className={c.hashtagable}>
          {ReferenceButton}
          <span className={c.part}>{fullIndex}</span>. {rule.title}
        </p>
        {Automatic}
        {Description}
        {Punishment}
      </>
    );
  }

  return (
    <>
      <p id={ruleId} className={c.hashtagable}>
        {ReferenceButton}
        <span className={c.part}>{fullIndex}</span> {rule.title}
      </p>
      {Automatic}
      {Description}
      {Punishment}
      {rest}
    </>
  );
};
