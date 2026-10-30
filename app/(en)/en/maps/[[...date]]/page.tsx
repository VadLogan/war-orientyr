import DashPage from "@/components/dash/DashPage";
import { dateParams, pageMeta, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = dateParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("en", "maps", params);
export default function Page({ params }: { params: DateParams }) {
  return <DashPage lang="en" params={params} view="maps" />;
}
