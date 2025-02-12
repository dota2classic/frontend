import { RichEditor } from "@/containers";
import { useLocalStorage } from "react-use";
import { RichPageRender } from "@/containers/RichEditor/RichPageRender";
import dynamic from "next/dynamic";

interface Props {}

function CreateBlog({}: Props) {
  const [value, setValue] = useLocalStorage<string>("edit");
  return (
    <>
      <RichEditor
        saveKey={"edit"}
        onChange={(e) => setValue(JSON.stringify(e.toJSON()))}
      />
      {value && <RichPageRender state={value} />}
    </>
  );
}

const CreateBlogPage = dynamic(() => Promise.resolve<unknown>(CreateBlog), {
  ssr: false,
});
export default CreateBlogPage;
