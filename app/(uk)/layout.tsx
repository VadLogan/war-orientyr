import Html, { siteMeta } from "@/components/Html";
import Strings from "@/components/strings/uk";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("uk");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="uk"><Strings>{children}</Strings></Html>;
}
