import DashPage from "@/components/dash/DashPage";
import { mapsParams, pageMeta, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = mapsParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("fr", "maps", params);
export default function Page({ params }: { params: DateParams }) {
  return <DashPage lang="fr" params={params} view="maps" />;
}
