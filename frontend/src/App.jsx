import React, { useEffect, useState } from "react";
import { StoreProvider } from "./store.jsx";
import { R, NL } from "./util.jsx";
import { Header, Footer } from "./components/Chrome.jsx";
import Navigator from "./screens/Navigator.jsx";
import Results from "./screens/Results.jsx";
import Calculator from "./screens/Calculator.jsx";
import Explore from "./screens/Explore.jsx";

const route = () => {
  const m = (location.hash || "").match(/^#\/(\w+)/);
  return m && R.indexOf(m[1]) > -1 ? m[1] : "navigator";
};
const V = { navigator: Navigator, results: Results, calculator: Calculator, explore: Explore };

function Shell() {
  const [k, setK] = useState(route);
  useEffect(() => {
    const h = () => { setK(route()); scrollTo(0, 0); const m = document.getElementById("main"); if (m) m.focus(); };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  useEffect(() => { document.title = "MeritSphere — " + NL[k]; }, [k]);
  const View = V[k];
  const skip = (e) => { e.preventDefault(); const m = document.getElementById("main"); if (m) m.focus(); };
  return (
    <>
      <a className="skip" href="#main" onClick={skip}>Skip to content</a>
      <div id="app">
        <Header k={k} />
        <main id="main" tabIndex={-1} className=""><div className="wrap pad"><View /></div></main>
        <Footer k={k} />
      </div>
    </>
  );
}

export default function App() { return <StoreProvider><Shell /></StoreProvider>; }
