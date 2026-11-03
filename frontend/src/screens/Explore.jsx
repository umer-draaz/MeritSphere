import React from "react";
import { useStore } from "../store.jsx";
import { EX } from "../data.js";
import { D } from "../store.jsx";
import { f2, inter, Fit, Icon, Seg, toast } from "../util.jsx";

const byId = (id) => EX.filter((p) => p.id === id)[0];

function exList(S) {
  const T = S.touched, qs = S.q.toLowerCase().split(/\s+/).filter(Boolean);
  const FR = { any: [0, 1e9], "50": [0, 50000], "50-100": [50000, 100000], "100-150": [100000, 150000], "150": [150000, 1e9] }[S.feeR] || [0, 1e9];
  const RD = { "5km": 5, "15km": 15, "25km": 25, "50km": 50, all: 1e9 }[S.rad];
  const L = EX.filter((p) => {
    const b = (p.name + " " + p.deg + " " + p.loc + " " + p.type + " Lahore").toLowerCase();
    return (!T.q || qs.every((w) => b.indexOf(w) > -1)) && (!T.sector || S.sector === "All Sectors" || p.sector === S.sector.split(" ")[0]) && (!T.feeR || p.feeN >= FR[0] && p.feeN < FR[1] + 1) && (!T.rad || p.km <= RD) && (!T.fSch || !S.fSch || p.schol) && (!T.fHost || !S.fHost || p.host);
  });
  const s = { chance: (a, b) => parseInt(b.ch) - parseInt(a.ch), fee: (a, b) => a.feeN - b.feeN, km: (a, b) => a.km - b.km, merit: (a, b) => b.merit - a.merit }[S.sort];
  return L.sort(s);
}

function useToggle() {
  const { S, set } = useStore();
  return (id, inExplore) => {
    const i = S.cmp.indexOf(id);
    if (i > -1) set({ cmp: S.cmp.filter((x) => x !== id) });
    else if (S.cmp.length >= 5) { toast("You can compare up to 5 programs."); return; }
    else set({ cmp: [...S.cmp, id] });
    if (!inExplore) toast(i > -1 ? "Removed from comparison" : "Added to comparison (" + (S.cmp.length + 1) + " of 5)");
  };
}

function ExCard({ p }) {
  const { S } = useStore();
  const toggle = useToggle();
  const on = S.cmp.indexOf(p.id) > -1;
  return (
    <article className="prog">
      <div style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 14 }}>
        <div className="serif" aria-hidden="true" style={{ width: 52, height: 52, border: "1px solid var(--line)", background: "var(--oat)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, fontSize: 16 }}>{p.ini}</div>
        <div>
          <div className="row between" style={{ alignItems: "flex-start" }}>
            <div><h3>{p.name}</h3><div className="m">{p.sec}</div></div>
            <Fit f={p.fit} t={p.chance} />
          </div>
          <p style={{ margin: "8px 0 4px" }}>{p.line}</p>
          <p className="m" style={{ margin: 0 }}>{p.loc} • {p.perk} • Tuition: {p.fee} / sem</p>
        </div>
      </div>
      <div className="pgrid">
        <div><div className="l">Closing '24</div><div className="v">{p.close}</div></div>
        <div><div className="l">Your Aggregate</div><div className="v">{p.agg}</div></div>
        <div><div className="l">Safety Margin</div><div className="v">{p.mar}</div></div>
        <div><div className="l">{p.fL}</div><div style={{ fontWeight: 500 }}>{p.fV}</div></div>
      </div>
      <div className="pacts">
        <label className="cb" style={{ display: "flex", gap: 8, margin: 0 }}><input type="checkbox" checked={on} onChange={() => toggle(p.id, true)} /> {on ? "In Comparison Tray" : "Add to Compare"}</label>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14 }}>{p.link}</a>
      </div>
    </article>
  );
}

function DockTab() {
  const { S } = useStore();
  const toggle = useToggle();
  const L = S.cmp.map(byId).filter(Boolean);
  if (L.length < 2) return <p className="note">Select at least two programs with Add to Compare (up to 5).</p>;
  const act = (p) => { if (p.id === "fast") { location.hash = "#/calculator"; } else toast("This action opens the university's portal in the full product."); };
  const { set } = useStore();
  const rows = [
    ["Estimated Chance", (p) => <><Fit f={p.fit} t={p.ch} /><div className="m">{p.chN || ""}{p.chX ? <><br />{p.chX}</> : null}</div></>],
    ["Tuition Fee / Sem", (p) => <><b>{p.fee}</b><div className="m">{p.feeNote || ""}{p.feeN2 ? <><br />{p.feeN2}</> : null}</div></>],
    ["2024 Closing Merit", (p) => <><b>{p.close}</b><div className="m">{p.wt}</div></>],
    ["Commute & Distance", (p) => <><b>{p.dist}</b><div className="m">{p.cmN}{p.distN2 ? " • " + p.distN2 : ""}</div></>],
    ["Merit Scholarships", (p) => <><b>{p.sch}</b><div className="m">{p.schN}</div></>],
    ["Mandatory Entrance Exam", (p) => <><b>{p.exam}</b><div className="m">{p.examN}</div></>],
    ["Trajectory Actions", (p) => <button className="btn sec sm" onClick={() => { if (p.id === "fast") set({ cp: 0 }); act(p); }}>{p.act}</button>],
  ];
  return (
    <>
      <div className="sc"><table>
        <thead><tr><th className="rowh">Metric / Dimension</th>
          {L.map((p) => <th scope="col" key={p.id}>{p.short}<div className="m" style={{ font: "400 14px DM Sans" }}>{p.deg}<br />{p.type}</div><button className="lnk" onClick={() => toggle(p.id, true)}>Remove</button></th>)}
        </tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}><th scope="row" className="rowh">{r[0]}</th>{L.map((p) => <td key={p.id}>{r[1](p)}</td>)}</tr>)}</tbody>
      </table></div>
      <p className="m" style={{ marginTop: 10 }}>Values computed against your profile: Matric: 91.2% • Inter-1: {f2(inter(S))}% • Predicted Entry: 78.00% · Diffing Mode Active ({L.length} / 5 Slots)</p>
    </>
  );
}

function ExMain() {
  const { S, set } = useStore();
  const L = exList(S);
  const reset = () => set({ touched: {}, q: D.q, deg: D.deg, shift: D.shift, feeR: D.feeR, rad: D.rad, sector: D.sector, fSch: true, fHost: true, fBus: false, sort: "chance", page: 1 });
  const pg = (id) => { const n = id === "+1" ? S.page + 1 : id === "-1" ? S.page - 1 : Number(id); set({ page: Math.max(1, Math.min(2, n)) }); };
  return (
    <>
      <p className="m" aria-live="polite" style={{ margin: "0 0 4px" }}>{S.page === 1 ? "Showing 1 - " + L.length + " of 8 matching programs" : ""}</p>
      {S.page === 1
        ? <div className={"listbox " + (S.layout === "grid" ? "grid" : "")}>{L.length ? L.map((p) => <ExCard key={p.id} p={p} />) : <p className="note">No sample program matches these filters. <button className="lnk" onClick={reset}>Reset Filters</button></p>}</div>
        : <p className="note" style={{ marginTop: 20 }}>Page 2: the remaining programs appear here once the full dataset is connected.</p>}
      <div className="row" style={{ marginTop: 20 }}>
        <button className="btn sec sm" onClick={() => pg("-1")} disabled={S.page === 1}>Previous</button>
        {[1, 2].map((n) => <button key={n} className={"btn " + (S.page === n ? "" : "sec ") + "sm"} onClick={() => pg(String(n))}>{n}</button>)}
        <button className="btn sec sm" onClick={() => pg("+1")} disabled={S.page === 2}>Next</button>
      </div>
    </>
  );
}

const fr = [["any", "Any Fee Structure", "48"], ["50", "Under PKR 50,000 / sem", "6"], ["50-100", "PKR 50k - 100k / sem", "18"], ["100-150", "PKR 100k - 150k / sem (Active)", "14"], ["150", "Above PKR 150k / sem", "10"]];

export default function Explore() {
  const { S, set, setField } = useStore();
  const lab = { fontWeight: 500, fontSize: 14 };
  const reset = () => set({ touched: {}, q: D.q, deg: D.deg, shift: D.shift, feeR: D.feeR, rad: D.rad, sector: D.sector, fSch: true, fHost: true, fBus: false, sort: "chance", page: 1 });
  const saveq = () => { try { localStorage.setItem("msf_persona", JSON.stringify({ q: S.q, feeR: S.feeR, rad: S.rad, sector: S.sector })); } catch (e) {} toast("Search persona saved on this device."); };
  const scrollTo$ = (id) => setTimeout(() => { const e = document.getElementById(id); if (e) e.scrollIntoView({ behavior: "smooth" }); }, 50);
  const stg = S.cmp.map((i) => byId(i).short).join(" vs ");
  return (
    <>
      <div className="card head"><div className="chips">
        <span><b>Profile Scope:</b> ICS CS • {f2(inter(S))}% Inter 1 • Lahore</span>
        <span><b>Active Filter count:</b> 4 applied (Max 120k Fee • 25km Radius • Verified Aid • Hostel)</span>
      </div>
        <div className="row"><button className="btn sec sm" onClick={reset}>Reset Filters</button><button className="btn sm" onClick={saveq}>Save Search Persona</button></div></div>
      <div className="eb" style={{ marginTop: 36 }}>HEC Accredited Admissions Matrix · Fall 2025 Admissions</div>
      <div className="hero3">
        <div><h1 style={{ marginTop: 12 }}>Explore Universities &amp; Comparative Analysis</h1><p className="sub">Fine-tune discovery across Pakistan with multi-dimensional filters for fee, location, and verified scholarships, or compare top options side by side.</p></div>
        <div className="stats three"><div><b>48</b><span className="m">Universities</span></div><div><b>136</b><span className="m">BS Programs</span></div><div><b>100%</b><span className="m">HEC Verified</span></div></div>
      </div>
      <div className="two rail">
        <aside className="stick card" style={{ padding: 22 }}>
          <div className="fld"><label htmlFor="q">Universal Academic Search</label><input id="q" type="text" value={S.q} onChange={(e) => setField("q", e.target.value)} placeholder="Search universities, programs, or cities..." /></div>
          <div className="sep"></div>
          <div className="lab" style={{ ...lab, marginBottom: 8 }}>Degree &amp; Shift <span className="m">Pre-Selected</span></div>
          <label className="cb" style={{ display: "flex", gap: 8, margin: "4px 0" }}><input type="radio" name="degree_level" value="bs" checked={S.deg === "bs"} onChange={(e) => setField("deg", e.target.value)} /> BS / Undergrad</label>
          <label className="cb" style={{ display: "flex", gap: 8, margin: "4px 0 12px" }}><input type="radio" name="degree_level" value="ms" checked={S.deg === "ms"} onChange={(e) => setField("deg", e.target.value)} /> MS / Graduate</label>
          <Seg g="shift" opts={["Morning Shift", "Evening / Self-Finance"]} cur={S.shift} />
          <div className="sep"></div>
          <div className="lab" style={{ ...lab, marginBottom: 6 }}>Fee Capacity per Semester <span className="m">Compliant: 14</span></div>
          {fr.map((f) => <label className="cb" key={f[0]} style={{ display: "flex", gap: 8, margin: "5px 0" }}><input type="radio" name="fee_filter" value={f[0]} checked={S.feeR === f[0]} onChange={(e) => setField("feeR", e.target.value)} /><span style={{ flex: 1 }}>{f[1]}</span><span className="m">{f[2]}</span></label>)}
          <div className="sep"></div>
          <div className="lab" style={{ ...lab, marginBottom: 6 }}>Max Radius from Residence <span className="m">25 km (Lahore)</span></div>
          <p className="m" style={{ margin: "0 0 8px" }}>Ref Point: Model Town / Gulberg Base</p>
          <Seg g="rad" opts={[["5km", "5km"], ["15km", "15km"], ["25km", "25km"], ["50km", "50km"], ["all", "All PK"]]} cur={S.rad} />
          <div className="sep"></div>
          <div className="lab" style={{ ...lab, marginBottom: 8 }}>Institutional Sector</div>
          <Seg g="sector" opts={["All Sectors", "Public (12)", "Private (20)"]} cur={S.sector} />
          <div className="sep"></div>
          <div className="lab" style={{ ...lab, marginBottom: 6 }}>Aid &amp; Mandatory Amenities</div>
          <label className="cb" style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}><input type="checkbox" checked={S.fSch} onChange={(e) => setField("fSch", e.target.checked)} /><span>Show Only Verified Scholarships<div className="m">Must offer &gt;50% fee off on entrance or merit rank</div></span></label>
          <label className="cb" style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}><input type="checkbox" checked={S.fHost} onChange={(e) => setField("fHost", e.target.checked)} /><span>Hostel Accommodation Available<div className="m">Verified</div></span></label>
          <label className="cb" style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}><input type="checkbox" checked={S.fBus} onChange={(e) => setField("fBus", e.target.checked)} /><span>Transport Facility / Bus Routes<div className="m">Optional</div></span></label>
          <div className="sep"></div>
          <label htmlFor="sort">Optimization Criterion</label>
          <select id="sort" value={S.sort} onChange={(e) => setField("sort", e.target.value)}>
            <option value="chance">Sort by Admission Chance (High to Low)</option>
            <option value="fee">Lowest Tuition Fee</option>
            <option value="km">Nearest Distance from Lahore</option>
            <option value="merit">Closing Merit Trend (Past 3 Years)</option>
          </select>
          <button className="btn" style={{ width: "100%", marginTop: 16 }} onClick={() => scrollTo$("exm")}>Update Program Discovery</button>
          <p className="note" style={{ marginTop: 18 }}><b style={{ color: "var(--ink)" }}>Formula Integrity Guarantee</b><br />Every admission aggregate threshold is cross-indexed against official University Gazette archives from 2022 to 2024.</p>
        </aside>
        <div>
          <div className="row between" style={{ marginBottom: 8, alignItems: "flex-end" }}>
            <div><h2>Showing 8 Matching Programs</h2><p className="m" style={{ margin: "4px 0 0" }}>Satisfying all criteria · Lahore Metro · Max 150k Fee · Within 25km · Hostel/Aid Verified</p></div>
            <div className="row"><span className="m">Layout:</span><Seg g="layout" opts={[["list", "List"], ["grid", "Grid"]]} cur={S.layout} /></div>
          </div>
          <div id="exm"><ExMain /></div>
          {S.dock ? (
            <section id="dock" style={{ marginTop: 52 }}>
              <div className="row between" style={{ alignItems: "flex-start" }}>
                <div><h2 id="dh">Active Comparison Dock ({S.cmp.length} Selected Programs)</h2><p className="m" style={{ margin: "4px 0 0" }}>Highlighted borders &amp; badges show statistical optimization for your {f2(inter(S))}% academic profile</p></div>
                <div className="row"><button className="btn sm" onClick={() => window.print()}><Icon name="print" />Export Matrix PDF</button><button className="btn sec sm" onClick={() => set({ dock: false })}>Close</button></div>
              </div>
              <div id="dtab" style={{ marginTop: 12 }}><DockTab /></div>
            </section>
          ) : <p className="note" style={{ marginTop: 40 }}>Comparison dock closed. <button className="lnk" onClick={() => set({ dock: true })}>Open it again</button></p>}
        </div>
      </div>
      <div className="dock"><div className="wrap">
        <span id="stg"><b>Comparison Staging: {S.cmp.length} of 5 Maximum Selected</b> <span className="m">{stg}</span></span>
        <span className="row"><button className="btn sec sm" onClick={() => set({ cmp: [] })}>Clear All</button><button className="btn sm" onClick={() => { set({ dock: true }); scrollTo$("dock"); }}>Open Full Diff Matrix</button></span>
      </div></div>
    </>
  );
}
