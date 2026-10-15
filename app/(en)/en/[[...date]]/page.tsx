import DigestPage from "@/components/DigestPage";
import { dateParams, pageMeta, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = dateParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("en", "digest", params);
export default function Page({ params }: { params: DateParams }) {
  return <DigestPage lang="en" params={params} />;
}
