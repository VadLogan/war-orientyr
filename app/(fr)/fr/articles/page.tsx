import ArticlesPage, { articlesMeta } from "@/components/ArticlesPage";

export const generateMetadata = () => articlesMeta("fr");
export default function Page() {
  return <ArticlesPage lang="fr" />;
}
