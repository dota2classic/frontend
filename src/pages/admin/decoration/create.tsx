import React from "react";
import { EditHatContainer } from "@/containers/EditHatContainer";
import { UserProfileDecorationType } from "@/api/back";
import { NextPageContext } from "next";

interface Props {
  type: UserProfileDecorationType;
}
export default function CreateHatPage({ type }: Props) {
  return <EditHatContainer decorationType={type} />;
}

CreateHatPage.getInitialProps = async (ctx: NextPageContext) => {
  return {
    type: ctx.query.type as UserProfileDecorationType,
  };
};
