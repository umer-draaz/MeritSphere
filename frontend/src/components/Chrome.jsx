import React from "react";
import { R, NL, LOGO, DISC, Icon } from "../util.jsx";

export function Header({ k }) {
  return (
    <header className="top"><div className="wrap">
      <a className="brand" href="#/navigator">{LOGO}MeritSphere</a>
      <nav aria-label="Main">{R.map((r) => <a key={r} href={"#/" + r} aria-current={r === k ? "page" : undefined}>{NL[r]}</a>)}</nav>
      <span className="who">Pre-Engineering • 88.4%</span>
      <a className="btn ink sm" href="#/navigator"><Icon name="bolt" />Quick Smart Check</a>
    </div></header>
  );
}

const dead = (e) => e.preventDefault();

export function Footer({ k }) {
  return (
    <>
      <footer><div className="wrap"><div className="fgrid4">
        <div>
          <a className="brand" href="#/navigator">{LOGO}MeritSphere</a>
          {k === "calculator" && <div className="m" style={{ marginTop: 6 }}>MeritSphere Advisory v2.4</div>}
          <p className="m" style={{ maxWidth: "34em" }}>{DISC}</p>
        </div>
        <div className="links">
          <a href="#" onClick={dead}>Official Merit Archives</a>
          <a href="#" onClick={dead}>Eligibility Criteria</a>
          <a href="#" onClick={dead}>Aggregate Formulas</a>
          <a href="#" onClick={dead}>Privacy &amp; Verification Policy</a>
        </div>
      </div></div></footer>
      <nav className="mnav" aria-label="Mobile">
        {[["navigator", "Navigator"], ["results", "Results"], ["calculator", "Marks Needed"], ["explore", "Explore"]].map((r) => (
          <a key={r[0]} href={"#/" + r[0]} aria-current={r[0] === k ? "page" : undefined}>{r[1]}</a>
        ))}
      </nav>
    </>
  );
}
