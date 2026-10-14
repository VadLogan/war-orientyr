import LegacyApp from "@/components/LegacyApp";

// Phase 1: the markup shell is React; the behaviour still lives in public/legacy/app.js
// (the original single-file script, unchanged) and is mounted by <LegacyApp/>.
export default function Page() {
  return (
    <>
      <div className="shell">
        <header className="topbar">
          <div className="brand" id="brand" />
          <div className="controls">
            <div className="seg" role="group" id="viewSeg">
              <button type="button" id="tabDigest" data-view="digest" />
              <button type="button" id="tabDash" data-view="dashboard" />
            </div>
            <div className="seg lang" role="group" aria-label="Мова / Language">
              <button type="button" id="langUk" data-lang="uk">UA</button>
              <button type="button" id="langEn" data-lang="en">EN</button>
            </div>
          </div>
        </header>
        <nav className="datebar" id="datebar" hidden />
        <div id="archiveNote" />
        <div id="mast" />
        <main id="main">
          <div className="col state">
            <div className="sk" style={{ width: "60%" }} />
            <div className="sk" style={{ width: "90%" }} />
            <div className="sk" style={{ width: "75%" }} />
          </div>
        </main>
      </div>
      <div id="tip" hidden />
      <LegacyApp />
    </>
  );
}
