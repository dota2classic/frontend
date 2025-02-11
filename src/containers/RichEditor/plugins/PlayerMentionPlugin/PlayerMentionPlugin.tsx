import * as React from "react";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";
import GenericMentionPlugin from "@/containers/RichEditor/plugins/GenericMentionPlugin/GenericMentionPlugin";
import { $createPlayerMentionNode } from "@/containers/RichEditor/plugins/PlayerMentionPlugin/PlayerMentionNode";
import { UserPreview } from "@/components";

export default function PlayerMentionPlugin() {
  return (
    <GenericMentionPlugin<UserDTO>
      searchProvider={(search) =>
        getApi().playerApi.playerControllerSearch(search, 25)
      }
      suggestionLimit={25}
      trigger={"@"}
      keyProvider={(it) => it.steamId}
      $createNode={(t) => $createPlayerMentionNode(t.steamId)}
      RenderListItem={(t) => (
        <UserPreview nolink avatarSize={30} user={t.option} />
      )}
    />
  );
}
