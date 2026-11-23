import Html, { siteMeta } from "@/components/Html";
import Strings from "@/components/strings/en";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="en"><Strings>{children}</Strings></Html>;
}
