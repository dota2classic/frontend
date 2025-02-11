import { RichEditor } from "@/containers";
import { RichPageRender } from "@/containers/RichEditor/RichPageRender";

interface Props {}
export default function CreateBlog({}: Props) {
  return (
    <>
      <RichEditor />
      {/*<RichPageRender />*/}
    </>
  );
}
