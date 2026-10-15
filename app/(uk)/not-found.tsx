import NotFound from "@/components/NotFound";
import { UI } from "@/lib/ui";

export const metadata = { title: UI.uk.nf.title };
export default function Page() {
  return <NotFound lang="uk" />;
}
