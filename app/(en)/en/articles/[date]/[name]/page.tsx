import ArticlePage, { articleMeta, articleParams, type ArticleParams } from "@/components/ArticlePage";

export const dynamicParams = false;
export const generateStaticParams = articleParams;
export const generateMetadata = ({ params }: { params: ArticleParams }) => articleMeta("en", params);
export default function Page({ params }: { params: ArticleParams }) {
  return <ArticlePage lang="en" params={params} />;
}
