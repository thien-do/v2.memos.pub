import "server-only";
import { BlogList } from "../list/type";
import { BlogParams } from "../type";
import { getBlogClean } from "./clean";
import { getBlogExact } from "./exact";
import { getBlogReadme } from "./readme";
import { BlogContent, BlogError } from "./type";

const NOT_FOUND: BlogError = {
  type: "error",
  message: "Not found",
};

export const getBlogContent = async (
  params: BlogParams
): Promise<BlogContent> => {
  const [exact, clean, readme] = await Promise.all([
    getBlogExact(params),
    getBlogClean(params),
    getBlogReadme(params),
  ]);

  if (exact === null) {
    // Maybe the path is a file with clean url
    return clean ?? NOT_FOUND;
  }

  if (exact.type === "post") return exact;
  if (exact.type === "error") return exact;

  // Exact is a list now
  const list: BlogList = { ...exact, readme };
  return list;
};