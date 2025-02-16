import { BlogEditContainer } from "@/containers";
import dynamic from "next/dynamic";
import React from "react";

function CreateBlog() {
  return <BlogEditContainer />;
}

const CreateBlogPage = dynamic<React.FC>(() => Promise.resolve(CreateBlog), {
  ssr: false,
});
export default CreateBlogPage;
