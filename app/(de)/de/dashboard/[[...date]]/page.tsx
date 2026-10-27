import DashPage from "@/components/dash/DashPage";
import { dateParams, pageMeta, type DateParams } from "@/lib/page";

// No German dashboard: the English one, with a notice (canonical = /en/dashboard).
export const dynamicParams = false;
export const generateStaticParams = dateParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("en", "dashboard", params);
export default function Page({ params }: { params: DateParams }) {
  return <div lang="en" style={{ display: "contents" }}><DashPage lang="en" params={params} from="de" /></div>;
}
