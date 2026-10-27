import Html, { siteMeta } from "@/components/Html";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("de");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="de">{children}</Html>;
}
