import React from "react";
import { useStore } from "./store.jsx";

export const f2 = (v) => v.toFixed(2);
export const money = (n) => "PKR " + Number(n).toLocaleString("en-US");
export const inter = (S) => Math.round(S.got / S.tot * 10000) / 100;
export const agg = (S) => .5 * inter(S) + .5 * S.test;
export const feeNum = (S) => parseInt(String(S.fee).replace(/\D/g, ""), 10) || 0;
export const FW = { safe: "Safe", target: "Target", reach: "Reach" };
export const FS = { safe: "✓", target: "◎", reach: "▲" };
export const fitOf = (d) => d >= 3 ? "safe" : d >= -2 ? "target" : "reach";

export const toast = (t) => {
  const e = document.createElement("div");
  e.className = "toast"; e.setAttribute("role", "status"); e.textContent = t;
  document.body.append(e);
  setTimeout(() => e.remove(), 2400);
};

export const R = ["navigator", "results", "calculator", "explore"];
export const NL = { navigator: "Admission Navigator", results: "My Results & Chances", calculator: "Marks Needed Calculator", explore: "Explore & Compare" };

export const Fit = ({ f, t }) => <span className={"fit f-" + f}>{FS[f] + " " + (t || FW[f])}</span>;

export const LOGO = (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="11" stroke="#292321" strokeWidth="1.5" /><path d="M2 13a11 5 0 0 0 22 0" stroke="#702D3A" strokeWidth="1.5" /></svg>
);

const IC = {
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6z" />,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  print: <path d="M7 9V3h10v6M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M7 14h10v7H7z" />,
};
export const Icon = ({ name, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IC[name]}</svg>
);

export const DISC = "© 2025 MeritSphere Advisory. All merit calculations, trajectory assessments, and admission quotas are mathematical estimates based on verified institutional closing records and are purely advisory.";

/* segmented button group */
export function Seg({ g, opts, cur, className = "seg", role = "group", label }) {
  const { pick } = useStore();
  return (
    <div className={className} role={role} aria-label={label}>
      {opts.map((o) => {
        const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o;
        return <button type="button" key={v} data-seg={g} data-v={v} aria-pressed={String(cur) === String(v)} onClick={() => pick(g, v)}>{l}</button>;
      })}
    </div>
  );
}

export const Opts = ({ arr }) => arr.map((o) => <option key={o}>{o}</option>);
