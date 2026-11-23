import DashPage from "@/components/dash/DashPage";
import Dashboard from "@/components/dash/Dashboard";
import { dashParams, pageMeta, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = dashParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("fr", "dashboard", params);
export default function Page({ params }: { params: DateParams }) {
  return <DashPage lang="fr" params={params} V={Dashboard} />;
}
