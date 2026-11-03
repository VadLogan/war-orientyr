/** schema.org JSON-LD for search engines (`<` escaped so text can't close the script). */
export default function Ld({ ld }: { ld: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />;
}
