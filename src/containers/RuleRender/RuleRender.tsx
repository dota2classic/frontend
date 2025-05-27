import React from "react";

import c from "./RuleRender.module.scss";
import { RuleDto } from "@/api/back";
import { FaHashtag } from "react-icons/fa";

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

  if (!parentIndexPrefix) {
    return (
      <>
        <h2 id={ruleId} className={c.hashtagable}>
          {ReferenceButton}
          Раздел <span className={c.part}>{fullIndex}</span>. {rule.description}
        </h2>
        {rest}
      </>
    );
  }

  if (!rule.children?.length) {
    return (
      <p id={ruleId} className={c.hashtagable}>
        {ReferenceButton}
        <span className={c.part}>{fullIndex}</span>. {rule.description}
      </p>
    );
  }

  return (
    <>
      <h3 id={ruleId} className={c.hashtagable}>
        {ReferenceButton}
        <span className={c.part}>{fullIndex}</span> {rule.description}
      </h3>
      {rest}
    </>
  );
};
