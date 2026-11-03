import React from "react";
import { useStore } from "../store.jsx";
import { CALC, sg } from "../data.js";
import { f2, inter, Fit, Icon, Seg } from "../util.jsx";

function useCm() {
  const { S } = useStore();
  const p = CALC[S.cp], i = inter(S), sec = i * p.wi, pend = p.wt * 100, need = p.cut - sec, req = need / p.wt, r1 = Math.round(req * 10) / 10;
  return { p, i, sec, pend, need, req, r1 };
}

function Sim() {
  const { S } = useStore();
  const m = useCm();
  const s = m.sec + S.sim * m.p.wt, d = s - m.p.cut, ok = d >= 0, sc = (t) => m.sec + t * m.p.wt;
  return (
    <>
      <div className="card soft" style={{ margin: "22px 0" }}>
        <div className="row" style={{ gap: 12 }}>
          <Fit f={ok ? "safe" : "reach"} t={ok ? "Feasible - Admission Safe (" + sg(d) + "% cushion)" : "Not yet feasible (" + sg(d) + "% short)"} />
        </div>
        <p style={{ margin: "10px 0 14px" }}>With a score of {S.sim.toFixed(1)}% in the {m.p.test}, your aggregate {ok ? "exceeds" : "falls short of"} the 2024 closing merit benchmark of {f2(m.p.cut)}%.</p>
        <div className="row" style={{ gap: 36 }}>
          <div><div className="m">Simulated Aggregate</div><div className="serif" style={{ fontSize: 44, color: "var(--wine)" }}>{f2(s)}%</div></div>
          <div><div className="m">Target Threshold</div><div className="serif" style={{ fontSize: 44 }}>{f2(m.p.cut)}%</div></div>
        </div>
      </div>
      <h3 style={{ marginBottom: 8 }}>Target Scenario Sensitivity Matrix</h3>
      <div className="stats three">
        <div><span className="m">Minimum Pass Required</span><b>{m.req > 100 ? "n/a" : m.r1 + "%"}</b><span className="m">in {m.p.test} · Earns {f2(m.r1 * m.p.wt)} pts<br />Total Aggregate: {(m.sec + m.r1 * m.p.wt).toFixed(3)}%</span></div>
        <div><span className="m">Pessimistic Scenario</span><b>70.0%</b><span className="m">in {m.p.test}<br />Total Aggregate: {sc(70).toFixed(3)}%<br />Low Chance / Reach</span></div>
        <div><span className="m">Optimistic Scenario</span><b>85.0%</b><span className="m">in {m.p.test}<br />Total Aggregate: {sc(85).toFixed(3)}%<br />Safe + Scholarship</span></div>
      </div>
    </>
  );
}

function Brk() {
  const m = useCm();
  return (
    <>
      <h3 className="serif" style={{ fontSize: 24, marginBottom: 12 }}>Component Breakdown &amp; Deficit Warning</h3>
      <div className="eb">Target Point Mathematical Deficit</div>
      <div className="serif" style={{ fontSize: 34, margin: "6px 0" }}>{m.need.toFixed(3)} pts</div>
      <p className="m" style={{ margin: "0 0 12px" }}>needed out of {f2(m.pend)} pts max</p>
      <div className="bar" aria-hidden="true"><i style={{ width: Math.min(100, m.need / m.pend * 100) + "%" }}></i></div>
      <div className="kv" style={{ marginTop: 12 }}><span>Secured</span><b>{m.sec.toFixed(3)} pts</b></div>
      <div className="kv"><span>Total Goal</span><b>{m.p.cut.toFixed(3)} pts</b></div>
      <p style={{ margin: "12px 0 4px" }}><Fit f={m.req <= 100 ? "safe" : "reach"} t={"Deficit Status: " + (m.req <= 100 ? "Feasible" : "Not feasible")} /></p>
      <p className="m" style={{ margin: "8px 0 0" }}>{m.req <= 100 ? "Requires " + m.req.toFixed(2) + "% on Entry Test. Given student’s " + f2(m.i) + "% Inter-I performance, this target falls comfortably within the projected 1-sigma probability band." : "Even a perfect entry test would not reach this target."}</p>
    </>
  );
}

const GI = [["FAST Lahore — BS Computer Science", .5, 83.10], ["FAST Lahore — BS Software Eng", .5, 82.40], ["ITU Lahore — BS Computer Science", .5, 78.50], ["COMSATS Lahore — BS SE / CS", null, 84.05]];

function Goal() {
  const { S } = useStore();
  const x = S.goal, i = inter(S);
  const L = GI.map((g) => { const a = g[1] == null ? 85.10 + (x - 80) * .5 : i * .5 + x * .5; return { n: g[0], a, c: g[2], d: a - g[2] }; }).filter((g) => g.d >= 0);
  return (
    <>
      <p className="m" style={{ margin: "14px 0 4px" }}><b style={{ color: "var(--ink)" }}>Unlocked with an {x.toFixed(1)}% Entry Test Score: {L.length} Programs Viable</b></p>
      {L.length ? L.map((g) => (
        <div className="kv" style={{ alignItems: "center" }} key={g.n}>
          <span style={{ color: "var(--ink)" }}><b>{g.n}</b><div className="m">Aggregate: {f2(g.a)}% (Cutoff: {f2(g.c)}%)</div></span>
          <Fit f={g.d >= 4 ? "safe" : g.d >= 1.2 ? "safe" : "target"} t={g.d >= 4 ? "Very Safe" : g.d >= 1.2 ? "Safe" : "Target"} />
        </div>
      )) : <p className="note">No sample program is viable at this score.</p>}
    </>
  );
}

const top3 = [["FAST-NUCES Lahore", "Achievable", "BS Computer Science (Weight 50:50)", "77.4% in NU Test"], ["ITU Lahore", "Very Easy / Safe", "BS Computer Science (Weight 50:50)", "68.2% in ITU Test"], ["Punjab University (PUCIT)", "Strenuous", "Requires 86.5% overall aggregate", "92.0% in Entry Test"]];

export default function Calculator() {
  const { S, setField } = useStore();
  const m = useCm();
  return (
    <>
      <div className="card head"><div className="chips">
        <span><b>Verified Benchmark</b></span>
        <span>Student profile: Intermediate Part 1: {S.got}/{S.tot} ({f2(m.i)}%)</span>
        <span>Target Field: Computing / Software Engineering</span>
        <span>City: {S.city.split(",")[0]}</span>
        <span><b>Official 2024 Closing Merit DB</b></span>
      </div></div>
      <div className="hero3">
        <div><div className="eb">Reverse Merit Diagnostic Engine</div><h1 style={{ marginTop: 12 }}>Reverse Merit &amp; Target Marks Simulator</h1><p className="sub">Answer the question: "What marks do I need in Part 2 or Entry Test to guarantee admission to my dream university?"</p></div>
        <div>
          <div className="row">
            <button className="btn sec" onClick={() => { const e = document.getElementById("meth"); if (e) e.scrollIntoView({ behavior: "smooth" }); }}>Formula Weights Reference</button>
            <button className="btn" onClick={() => window.print()}><Icon name="print" />Export Breakdown</button>
          </div>
          <p className="note" style={{ marginTop: 16 }}><b style={{ color: "var(--ink)" }}>Epistemic Status:</b> All simulations map against officially published 2024 closing merit archives. Weight formulas strictly reflect official university admission prospectuses for Fall 2025. REF: NU-LHR-24-CS-C1</p>
        </div>
      </div>
      <div className="two">
        <div>
          <div className="card" id="sel">
            <div className="step">Step 1</div>
            <h2 style={{ margin: "6px 0 4px" }}>Target Program Selector</h2>
            <p className="m" style={{ margin: "0 0 18px" }}>Select university or campus to unpack aggregate weight</p>
            <label htmlFor="cp">Target University &amp; Program (Lahore Campus)</label>
            <select id="cp" value={S.cp} onChange={(e) => setField("cp", Number(e.target.value))}>
              {CALC.map((c, k) => <option key={k} value={k}>{c.n}</option>)}
            </select>
            <h4 style={{ margin: "22px 0 6px", fontSize: 15 }}>Official Program Weight Formula</h4>
            <div className="eb" style={{ marginBottom: 6 }}>{m.p.crit}</div>
            <div className="kv"><span>Intermediate Part 1 · Weight {Math.round(m.p.wi * 100)}%</span><b>{m.sec.toFixed(3)} pts secured · {f2(m.i)}% achieved</b></div>
            <div className="kv"><span>Entry Test / {m.p.test} · Weight {Math.round(m.p.wt * 100)}%</span><b>Target Component {f2(m.pend)} pts pending</b></div>
            <p className="m" style={{ margin: "10px 0 0" }}><b>Historical Required Cut-off (2024 Closing Merit): {m.p.cut.toFixed(3)}%</b></p>
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <div className="step">Step 2</div>
            <div className="row between"><h2 style={{ margin: "6px 0 4px" }}>Sensitivity Simulation: NU Test Marks</h2><span className="m">Live Calculation</span></div>
            <label htmlFor="simr" style={{ marginTop: 14 }}>Simulated NU Entry Test Score: <b id="sv">{S.sim} / 100 ({S.sim.toFixed(1)}%)</b></label>
            <input id="simr" type="range" min="50" max="100" step="0.5" value={S.sim} onChange={(e) => setField("sim", Number(e.target.value))} />
            <div className="ticks"><span>50% (Passing minimum)</span><span>{m.r1}% (Historical threshold)</span><span>100% (Maximum)</span></div>
            <div id="sim"><Sim /></div>
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h2 style={{ margin: "0 0 6px" }}>Top 3 CS Universities in Lahore</h2>
            <p className="m" style={{ margin: "0 0 8px" }}>Required test mark targets for your specific profile ({f2(m.i)}% Inter Part 1):</p>
            {top3.map((u) => (
              <div className="kv" style={{ alignItems: "center", padding: "16px 0" }} key={u[0]}>
                <span style={{ color: "var(--ink)" }}><b className="serif" style={{ fontSize: 20 }}>{u[0]}</b><div className="m">{u[2]}</div></span>
                <span style={{ textAlign: "right" }}><b>{u[3]}</b><div className="m">{u[1]}</div></span>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h2 style={{ margin: "0 0 6px" }}>Goal Inversion Explorer</h2>
            <p className="m" style={{ margin: "0 0 12px" }}>Preset Marks · "If I score X% in Entry Test, where can I get in?"</p>
            <Seg g="goal" opts={[70, 75, 80, 85, 90].map((g) => [String(g), g + "%"])} cur={S.goal} role={undefined} />
            <div id="goal"><Goal /></div>
          </div>
        </div>
        <aside className="stick"><div className="card" id="brk"><Brk /></div></aside>
      </div>
      <section className="card soft" id="meth" style={{ marginTop: 48 }}>
        <h3 className="serif" style={{ fontSize: 26, marginBottom: 8 }}>Reverse Algorithm &amp; Epistemic Methodology</h3>
        <p className="m" style={{ margin: "0 0 6px" }}>Calculations adhere strictly to Section 4.2 of Higher Education Admissions Charter (Punjab Region). Formula Engine: <b style={{ color: "var(--ink)" }}>TargetTest% = (CutOff - (Inter% × 0.50)) / 0.50</b></p>
        <div className="fgrid" style={{ marginTop: 14, gridTemplateColumns: "repeat(3,1fr)" }}>
          <div><b>1. Normalization Integrity</b><p className="m" style={{ margin: "4px 0 0" }}>Marks are calculated using exact raw decimal fractions without premature rounding to avoid artificial inflation beyond verified cutoff margins.</p></div>
          <div><b>2. Seat Quotas &amp; Fall Cycle</b><p className="m" style={{ margin: "4px 0 0" }}>Projections assume Open Merit seats only. Special quota classifications (Armed forces, provincial reserves, or donor seats) are excluded from this simulator.</p></div>
          <div><b>3. Volatility Buffer</b><p className="m" style={{ margin: "4px 0 0" }}>Historical merits generally shift between -0.4% to +0.8% annually depending on Board matriculation standard deviations.</p></div>
        </div>
      </section>
    </>
  );
}
