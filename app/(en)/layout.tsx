import Html from "@/components/Html";
export { metadata, viewport } from "@/components/Html";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Html lang="en">{children}</Html>;
}
