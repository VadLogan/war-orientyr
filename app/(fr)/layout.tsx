import Html, { siteMeta } from "@/components/Html";
import Strings from "@/components/strings/fr";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("fr");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="fr"><Strings>{children}</Strings></Html>;
}
