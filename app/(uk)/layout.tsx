import Html, { siteMeta } from "@/components/Html";
export { viewport } from "@/components/Html";

export const metadata = siteMeta("uk");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="uk">{children}</Html>;
}
