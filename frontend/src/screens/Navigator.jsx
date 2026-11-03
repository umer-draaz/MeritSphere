import React, { useState } from "react";
import { useStore, go } from "../store.jsx";
import { f2, money, inter, agg, feeNum, Fit, Icon, Seg, Opts, toast } from "../util.jsx";
import { sg } from "../data.js";

function Sheet() {
  const { S } = useStore();
  const i = inter(S), a = agg(S);
  return (
    <>
      <div className="eb">Live Simulation · Auto-updating</div>
      <h3 className="serif" style={{ fontSize: 24, margin: "8px 0 6px" }}>Your Instant Admission Trajectory</h3>
      <p className="m" style={{ margin: "0 0 14px" }}>Formula: NUST Computing Aggregate (50% FSC + 50% NET)</p>
      <div className="m">Estimated Aggregate</div>
      <div className="big" style={{ margin: "4px 0 12px" }}>{f2(a)}%</div>
      <div className="kv"><span>FSc Part 1 (50% wt)</span><b>{f2(i * .5)} pts</b></div>
      <div className="kv"><span>Assumed NET (50% wt)</span><b>{f2(S.test * .5)} pts</b></div>
      <h4 style={{ margin: "22px 0 4px", fontSize: 15 }}>Estimated Eligibility Distribution</h4>
      <div className="stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><b>18</b><span className="m">Safe Programs<br />18 Programs</span></div>
        <div><b>9</b><span className="m">Target Programs<br />9 Programs</span></div>
        <div style={{ marginTop: 14 }}><b>4</b><span className="m">Reach Programs<br />4 Programs</span></div>
        <div style={{ marginTop: 14 }}><b>6</b><span className="m">Scholarships<br />6 Verified</span></div>
      </div>
      <div className="sep"></div>
      <div><b>SEECS CS Closing Merit: 81.15%</b></div>
      <div style={{ marginTop: 6 }}>
        {a >= 81.15 ? <Fit f="safe" t={"Safe by " + sg(a - 81.15) + "%"} /> : <Fit f="reach" t={"Below by " + sg(a - 81.15) + "%"} />}
      </div>
    </>
  );
}

const launchers = [["1", "What entry marks do I need for FAST CS Lahore?", "q1"], ["2", "Find Software Engineering under PKR 100k fee/sem", "q2"], ["3", "View 100% Merit Scholarship options for 88%+ Marks", "q3"]];

export default function Navigator() {
  const { S, set, setField } = useStore();
  const [imgOk, setImgOk] = useState(true);
  const i = inter(S);
  const lab = { fontWeight: 500, fontSize: 14 };

  const near = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => set({ city: "Current location (detected)" }),
        () => toast("Location permission was not granted.")
      );
    } else toast("Location detection is not available.");
  };
  const launch = (q) => {
    if (q === "q1") { set({ cp: 0 }); go("calculator"); }
    if (q === "q2") { set((s) => ({ q: "Software Engineering", feeR: "50-100", touched: { ...s.touched, q: 1, feeR: 1 }, sort: "fee" })); go("explore"); }
    if (q === "q3") { set({ tab: "schol" }); go("results"); }
  };

  return (
    <>
      <section className="hero4">
        <div>
          <span className="fit f-target">HEC 2024-25 Calibrated</span>
          <h1>Discover Your Best Universities Across Pakistan in Minutes</h1>
          <p className="sub">Minimal inputs, maximum clarity. Enter your current academic standing to get instant merit aggregates, admission probabilities, fee-matching, and scholarships based on official closing archives.</p>
          <div className="row" style={{ marginTop: 26, gap: 18 }}>
            <a className="btn" href="#chk" onClick={(e) => { e.preventDefault(); const fm = document.getElementById("chk"); if (fm) fm.scrollIntoView({ behavior: "smooth" }); }}>Start Smart Check<Icon name="arrow" className="after" /></a>
            <span className="m who2">Pre-Engineering • 88.4%</span>
          </div>
        </div>
        <figure className="h4-fig">
          {imgOk && <img onError={() => setImgOk(false)} src="https://images.unsplash.com/photo-1741637335289-c99652d3155f?fm=jpg&q=75&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Students walking past a campus building under a tree" width="1400" height="933" />}
          <figcaption>Photo: Zoshua Colah / Unsplash</figcaption>
          <div className="card h4-card">
            <b>Verified Official Archive Data (Fall 2024)</b>
            <p className="m" style={{ margin: "6px 0 10px" }}>Calculations adhere directly to official university quotas (UET Lahore, FAST-NUCES, NUST, GIKI, COMSATS, IBA Karachi &amp; PU).</p>
            <span className="fit f-safe">✓ Updated 14 hours ago</span>
          </div>
        </figure>
      </section>
      <p className="strip">Empowering 320,000+ Pakistani College Students with Clear Merit Guidance</p>
      <div className="two">
        <form id="chk" noValidate onSubmit={(e) => { e.preventDefault(); set({ tab: "all" }); go("results"); }}>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="step">Step 1 of 2</div>
            <h2 style={{ margin: "6px 0 4px" }}>Academic Standing &amp; Criteria</h2>
            <p className="m" style={{ margin: "0 0 22px" }}>Define your stage to calculate exact weighted merit points</p>
            <div className="lab" style={{ ...lab, marginBottom: 8 }}>Academic Status</div>
            <Seg g="status" opts={["Inter Part 1", "Part 2 Awaited", "FSc Completed", "A-Levels / Other"]} cur={S.status} />
            <div className="lab" style={{ ...lab, margin: "22px 0 8px" }}>Intermediate Discipline / High School Group</div>
            <Seg g="disc" opts={["Pre-Engineering", "Pre-Medical", "ICS (Computer Science)", "General Science", "I.Com / Commerce"]} cur={S.disc} />
            <div className="sep"></div>
            <h3 style={{ marginBottom: 4 }}>Intermediate Part 1 Marks (Board Examination)</h3>
            <p className="m" style={{ margin: "0 0 14px" }} id="ih">✓ {f2(i)}% (Final - Board Verified)</p>
            <div className="fgrid">
              <div><label htmlFor="got">Marks Obtained</label><input id="got" type="number" min="0" value={S.got} onChange={(e) => setField("got", Number(e.target.value))} /></div>
              <div><label htmlFor="tot">Total Marks Possible</label><input id="tot" type="number" min="1" value={S.tot} onChange={(e) => setField("tot", Number(e.target.value))} /></div>
            </div>
            <div className="sep"></div>
            <h3 style={{ marginBottom: 4 }}>Entry Test Standing</h3>
            <p className="m" style={{ margin: "0 0 14px" }}>Clearly labeled as estimate in calculations. You can test various target scores.</p>
            <Seg g="mode" opts={[["taken", "Test Taken"], ["assumed", "Assumed / Target Score"]]} cur={S.mode} />
            <div className="fgrid" style={{ marginTop: 20 }}>
              <div className="full"><label htmlFor="tsel">Select Admission Test</label>
                <select id="tsel" value={S.tsel} onChange={(e) => setField("tsel", e.target.value)}>
                  <Opts arr={["NUST NET (Engineering & Computing)", "FAST Nu-Test (Lahore / Isb / Khi)", "UET ECAT (Punjab Combined)", "NTS NAT-IE (Pre-Engineering)", "GIKI Engineering Admission Test"]} />
                </select></div>
              <div className="full"><label htmlFor="test">Target Score: <b id="tv">{S.test}</b> / 100 <span className="m" id="tv2">{S.test.toFixed(1)}%</span></label>
                <input id="test" type="range" min="40" max="100" step="0.5" value={S.test} onChange={(e) => setField("test", Number(e.target.value))} /></div>
            </div>
          </div>
          <div className="card">
            <div className="step">Step 2 of 2</div>
            <h3 className="serif" style={{ fontSize: 26, margin: "6px 0 20px" }}>Location &amp; Budget Preferences</h3>
            <div className="fgrid">
              <div><label htmlFor="city">Preferred Campus Hub</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input id="city" type="text" value={S.city} onChange={(e) => setField("city", e.target.value)} />
                  <button type="button" className="btn sec" onClick={near} style={{ whiteSpace: "nowrap" }}><Icon name="pin" />Detect Near Me</button>
                </div></div>
              <div><label htmlFor="fee">Max Fee / Semester <b id="fv">{money(feeNum(S))}</b></label>
                <input id="fee" type="text" value={S.fee} onChange={(e) => setField("fee", e.target.value)} /></div>
              <div className="full"><label htmlFor="uni">Optional Target Universities</label>
                <input id="uni" type="text" value={S.uni} onChange={(e) => setField("uni", e.target.value)} placeholder="e.g. FAST Lahore, NUST, UET or leave blank for all recommendations" /></div>
            </div>
            <label className="cb" style={{ display: "flex", gap: 10, marginTop: 18 }}><input type="checkbox" checked={S.hostel} onChange={(e) => setField("hostel", e.target.checked)} /> Need Hostel Accommodation</label>
            <label className="cb" style={{ display: "flex", gap: 10, marginTop: 8 }}><input type="checkbox" checked={S.schol} onChange={(e) => setField("schol", e.target.checked)} /> Show Scholarships for my Marks</label>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 26 }}>
              <button className="btn">Calculate Aggregate &amp; Match Universities<Icon name="arrow" className="after" /></button>
              <span className="m">No registration required for initial assessment • Verified Institutional Logic</span>
            </div>
          </div>
        </form>
        <aside className="stick">
          <div className="card" id="sheet" aria-live="polite"><Sheet /></div>
          <div className="card" style={{ marginTop: 20 }}>
            <div className="eb" style={{ marginBottom: 10 }}>Smart Question Quick Launchers</div>
            {launchers.map((q) => (
              <button key={q[2]} type="button" onClick={() => launch(q[2])} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 8, textAlign: "left", width: "100%", background: "none", border: 0, borderTop: "1px solid var(--line)", padding: "12px 0", font: "15px DM Sans", cursor: "pointer", color: "var(--ink)" }}>
                <b className="serif" style={{ color: "var(--wine)" }}>{q[0]}</b><span>{q[1]} →</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
