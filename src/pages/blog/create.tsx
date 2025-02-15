import { BlogEditContainer } from "@/containers";
import dynamic from "next/dynamic";

function CreateBlog() {
  return <BlogEditContainer />;
}

const CreateBlogPage = dynamic(() => Promise.resolve<unknown>(CreateBlog), {
  ssr: false,
});
export default CreateBlogPage;
