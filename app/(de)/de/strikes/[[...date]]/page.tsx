import DashPage from "@/components/dash/DashPage";
import { pageMeta, strikesParams, type DateParams } from "@/lib/page";

export const dynamicParams = false;
export const generateStaticParams = strikesParams;
export const generateMetadata = ({ params }: { params: DateParams }) => pageMeta("de", "strikes", params);
export default function Page({ params }: { params: DateParams }) {
  return <DashPage lang="de" params={params} view="strikes" />;
}
