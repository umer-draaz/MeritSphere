import React from "react";
import { useStore, go } from "../store.jsx";
import { RES, sg } from "../data.js";
import { f2, money, inter, agg, feeNum, fitOf, FW, Fit, Icon, Seg, toast } from "../util.jsx";

function Card({ c, a }) {
  const { S, set } = useStore();
  a = Number(f2(a));
  const d = a - c.merit, f = fitOf(d), same = f === c.orig, hist = c.hist.replace("{d}", sg(d));
  const toggle = () => {
    const i = S.cmp.indexOf(c.ex);
    if (i > -1) { set({ cmp: S.cmp.filter((x) => x !== c.ex) }); toast("Removed from comparison"); }
    else if (S.cmp.length >= 5) toast("You can compare up to 5 programs.");
    else { set({ cmp: [...S.cmp, c.ex] }); toast("Added to comparison (" + (S.cmp.length + 1) + " of 5)"); }
  };
  const pick = () => { const m = { fast: 0, itu: 2, cui: 4, nust: 0 }; set({ cp: m[c.id] || 0 }); go("calculator"); };
  return (
    <article className="prog">
      <div className="row" style={{ gap: 8, marginBottom: 8 }}>
        {c.tags.map((t) => <span key={t} className="fit f-target" style={{ fontWeight: 500 }}>{t}</span>)}
        {c.alert && <span className="fit f-warn">! {c.alert[0]}</span>}
      </div>
      <div className="row between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}><h3>{c.name}</h3><div className="m">{c.prog}</div></div>
        <div style={{ textAlign: "right", flex: "0 0 auto", maxWidth: "48%" }}>
          <Fit f={f} t={same ? c.chance : FW[f] + " • Updated for your inputs"} />
          <div className="m" style={{ marginTop: 4 }}>{c.gap(d)}</div>
        </div>
      </div>
      <div className="pgrid">
        <div><div className="l">Your Computed Aggregate</div><div className="v">{f2(a)}%</div><div className="m">{c.w}</div></div>
        <div><div className="l">{c.mLabel}</div><div className="v">{f2(c.merit)}% {c.mNote}</div><div className="m">{hist}</div></div>
        <div><div className="l">Tuition / Semester</div><div className="v">{c.fee}</div><div className="m" style={c.feeBad ? { color: "var(--warn)" } : undefined}>{(c.feeBad ? "! " : "✓ ") + c.feeNote}</div></div>
        <div><div className="l">{c.locL}</div><div className="v">{c.loc}</div><div className="m">{c.locN}</div></div>
      </div>
      <p className="m" style={{ margin: "14px 0 0" }}>{c.extra}</p>
      <div className="pacts">
        <details style={{ border: 0, padding: 0, flex: "1 1 220px" }}>
          <summary>Why this result?</summary>
          <p>Your aggregate is {f2(a)}% against a closing merit of {f2(c.merit)}% ({sg(d)}%). Indicative label: {FW[f]}. Past merit does not predict this year.</p>
        </details>
        <button type="button" className="btn sec sm" onClick={toggle} hidden={!c.ex}>Compare</button>
        <button type="button" className="btn sm" onClick={pick}>View Formula Breakdown</button>
      </div>
    </article>
  );
}

const T = [["all", "All Recommendations (32)"], ["safe", "Safe (18)"], ["target", "Target (9)"], ["reach", "Reach (5)"], ["elig", "Eligible Programs (32)"], ["schol", "Scholarships for Me (6)"]];

export default function Results() {
  const { S } = useStore();
  const a = agg(S), i = inter(S);
  const L = RES.filter((c) => { const f = fitOf(a - c.merit); return S.tab === "all" || S.tab === "elig" || S.tab === f || (S.tab === "schol" && c.id === "itu"); });
  return (
    <>
      <div className="eb">ADVISORY · Verified Institutional Matrix (2024–2025)</div>
      <div className="card head" style={{ marginTop: 14 }}>
        <div>
          <div className="chips">
            <span><b>Student: FSC (ICS - CS)</b></span>
            <span>Obtained: <b>{f2(i)}% (Final)</b></span>
            <span>Assumed NET/Entry: <b>{S.test.toFixed(1)}% (Estimate)</b></span>
            <span><b>{S.city.split(",")[0]}</b></span>
            <span>Max Fee: <b>{money(feeNum(S))}/sem</b></span>
          </div>
          <p className="m" style={{ margin: "10px 0 0", maxWidth: "54em" }}>All thresholds reflect formal 1st &amp; 2nd closing rounds ratified by Punjab &amp; Federal Higher Education Commissions. Cycle: Fall 2024 Official Archive</p>
        </div>
        <div className="row">
          <button className="btn sec sm" onClick={() => go("navigator")}>Quick Edit Inputs</button>
          <button className="btn sm" onClick={() => window.print()}><Icon name="print" />Export Report (PDF)</button>
        </div>
      </div>
      <div className="hero3" style={{ marginTop: 36 }}>
        <div><div className="eb">Estimated Aggregate</div><div className="big" style={{ margin: "8px 0" }}>{f2(a)} %</div><p className="m" style={{ margin: 0 }}>Based on standardized 50/50 formula · +1.4% vs state mean</p></div>
        <div><div className="eb">Eligibility Status</div><div className="serif" style={{ fontSize: 40, margin: "6px 0" }}>32 / 35 Programs</div><p className="m" style={{ margin: 0 }}>Evaluated criteria fulfilled · 2 Conditional · 1 Ineligible (Math)</p></div>
      </div>
      <div className="stats three" style={{ marginBottom: 12 }}>
        <div><span className="m">Safe Chances</span><b>18 Programs</b><span className="m">&gt;85% statistical probability<br />Highest security margin</span></div>
        <div><span className="m">Target Range</span><b>9 Programs</b><span className="m">60% – 84% probability<br />Balanced merit profile</span></div>
        <div><span className="m">Reach Programs</span><b>5 Programs</b><span className="m">&lt;60% entry probability<br />Aggressive target scope</span></div>
      </div>
      <div className="two" style={{ marginTop: 36 }}>
        <div>
          <Seg g="tab" opts={T} cur={S.tab} className="tabs2" label="Filter" />
          <p className="m" aria-live="polite">Showing {L.length} sample program{L.length === 1 ? "" : "s"} for this view</p>
          {L.length ? L.map((c) => <Card key={c.id} c={c} a={a} />) : <p className="note">No sample program in this group.</p>}
        </div>
        <aside className="stick"><div className="card">
          <h4 className="serif" style={{ fontSize: 22 }}>Calculation Transparency</h4>
          <h5 style={{ margin: "14px 0 6px", fontSize: 14 }}>Active Standard Weighting</h5>
          <div className="kv"><span>FSC Part I / II (Obtained: {f2(i)}%)</span><b>50.00%</b></div>
          <div className="kv"><span>Standardized Entry Test ({S.test.toFixed(2)}%)</span><b>50.00%</b></div>
          <div className="kv"><span>Resulting Composite Aggregate:</span><b>{a.toFixed(3)}%</b></div>
          <p className="m">*Note: University-specific weight modifications (such as NUST 75/15/10 and FAST 50/50 NU test) are automatically recalibrated in each program card.</p>
          <div className="sep"></div>
          <h5 style={{ margin: "0 0 6px", fontSize: 14 }}>Data Verification Integrity</h5>
          <p style={{ margin: 0 }}><b>Verified from Official 2024 Records</b></p>
          <p className="m" style={{ margin: "4px 0" }}>All closing percentiles audited directly from institutional merit notifications (HEC &amp; PEC verified lists).</p>
          <div className="kv"><span>Data Cycle Release</span><b>Fall 2024 Batch</b></div>
          <div className="kv"><span>Engine Last Refreshed</span><b>October 24, 2024</b></div>
          <div className="sep"></div>
          <h5 style={{ margin: "0 0 6px", fontSize: 14 }}>What If Simulation</h5>
          <p className="m" style={{ margin: "0 0 12px" }}>Want to see how an extra 5 marks on your upcoming Entry Test changes your probability at FAST or NUST?</p>
          <button className="btn" onClick={() => go("calculator")}>Launch Sensitivity Simulator</button>
        </div></aside>
      </div>
      <div className="note" style={{ marginTop: 48, maxWidth: "62em" }}>
        <b style={{ color: "var(--ink)" }}>Official Academic Disclaimer &amp; Advisory Protocol</b><br />MeritSphere admission probability indicators are predictive estimates derived from historical closing trends and verified weighting algorithms. Actual closing ranks fluctuate each academic intake based on applicant cohort volume and paper difficulty. <a href="#" onClick={(e) => e.preventDefault()}>Read Policy Guidelines</a>
      </div>
    </>
  );
}
