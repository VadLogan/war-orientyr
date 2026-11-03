import ArticlesPage, { articlesMeta } from "@/components/ArticlesPage";

export const generateMetadata = () => articlesMeta("uk");
export default function Page() {
  return <ArticlesPage lang="uk" />;
}
