import { Landing } from "@/components/Landing";
import { AggregatedStatsDto, BlogPageDto } from "@/api/back";
import { getApi } from "@/api/hooks";

interface LandingProps {
  blog: BlogPageDto;
  agg: AggregatedStatsDto;
}
export default function Home({ blog, agg }: LandingProps) {
  return <Landing recentPosts={blog.data} live={[]} aggStats={agg} />;
}

Home.getInitialProps = async (): Promise<LandingProps> => {
  const [blog, agg] = await Promise.combine([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi().statsApi.statsControllerGetAggStats(),
  ]);
  return {
    blog,
    agg,
  };
};
