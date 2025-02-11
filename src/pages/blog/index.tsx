import { getExampleMarkdown } from "@/util/markdown";
import { Rubik } from "next/font/google";
import { MarkdownPost } from "@/components";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});
interface Props {
  postData: {
    contentHtml: string;
  };
}

export default function RenderMarkdown({ postData }: Props) {
  return (
    <div className={threadFont.className}>
      <MarkdownPost markdown={postData.contentHtml} />
    </div>
  );
}

export async function getStaticProps({}) {
  // Add the "await" keyword like this:
  const postData = await getExampleMarkdown();

  return {
    props: {
      postData,
    },
  };
}
