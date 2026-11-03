import ArticlesPage, { articlesMeta } from "@/components/ArticlesPage";

export const generateMetadata = () => articlesMeta("en");
export default function Page() {
  return <ArticlesPage lang="en" />;
}
