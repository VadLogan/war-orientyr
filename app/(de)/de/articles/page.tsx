import ArticlesPage, { articlesMeta } from "@/components/ArticlesPage";

export const generateMetadata = () => articlesMeta("de");
export default function Page() {
  return <ArticlesPage lang="de" />;
}
