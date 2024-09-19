import { Landing } from "@/components";

export default function Home() {
  // const liveMatch = useEventSource<LiveMatchDto>(
  //   useApi().liveApi.liveMatchControllerLiveMatchContext({ id: 15624 }),
  //   LiveMatchDtoFromJSON.bind(null),
  // );

  return <Landing />;
}
