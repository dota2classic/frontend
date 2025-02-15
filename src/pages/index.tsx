import { Landing } from "@/components";
import { BlogPageDto } from "@/api/back";
import { getApi } from "@/api/hooks";

interface LandingProps {
  blog: BlogPageDto;
}
export default function Home({ blog }: LandingProps) {
  return <Landing recentPosts={blog.data} />;
}

Home.getInitialProps = async (): Promise<LandingProps> => {
  return {
    blog: await getApi().blog.blogpostControllerBlogPage(0, 3),
  };
};
