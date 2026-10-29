import DashPage from "@/components/dash/DashPage";
import { dateParams, pageMeta, type DateParams } from "@/lib/page";

// No German strikes page: the English one, with a notice (canonical = /en/strikes).
export const dynamicParams = false;
export const generateStaticParams = dateParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("en", "strikes", params);
export default function Page({ params }: { params: DateParams }) {
  return <div lang="en" style={{ display: "contents" }}><DashPage lang="en" params={params} view="strikes" from="de" /></div>;
}
