import Html, { siteMeta } from "@/components/Html";
import Strings from "@/components/strings/de";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("de");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="de"><Strings>{children}</Strings></Html>;
}
