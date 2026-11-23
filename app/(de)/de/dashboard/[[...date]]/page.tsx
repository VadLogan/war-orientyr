import DashPage from "@/components/dash/DashPage";
import Dashboard from "@/components/dash/Dashboard";
import { dashParams, pageMeta, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = dashParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("de", "dashboard", params);
export default function Page({ params }: { params: DateParams }) {
  return <DashPage lang="de" params={params} V={Dashboard} />;
}
