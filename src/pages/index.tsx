import { Landing } from "@/components/Landing";
import { BlogPageDto, LiveMatchDto } from "@/api/back";
import { getApi } from "@/api/hooks";

interface LandingProps {
  blog: BlogPageDto;
  live: LiveMatchDto[];
}
export default function Home({ blog, live }: LandingProps) {
  return <Landing recentPosts={blog.data} live={live} />;
}

Home.getInitialProps = async (): Promise<LandingProps> => {
  const [blog, live] = await Promise.combine([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi().liveApi.liveMatchControllerListMatches(),
  ]);
  return {
    blog,
    live,
  };
};
