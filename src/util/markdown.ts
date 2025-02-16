import * as path from "node:path";
import * as fs from "node:fs";
import { remark } from "remark";
import html from "remark-html";

interface Md {
  contentHtml: string;
}
export async function getExampleMarkdown(): Promise<Md> {
  const fullPath = path.join("posts", `example.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(fileContents);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    contentHtml,
  };
}
