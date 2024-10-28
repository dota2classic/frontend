import { MatchDto } from "@/api/back";

export function MatchComparator(a: MatchDto, b: MatchDto) {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}
