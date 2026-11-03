import React, { createContext, useContext, useEffect, useState } from "react";

export const D = {status:"Part 2 Awaited",disc:"Pre-Engineering",mode:"assumed",got:462,tot:520,test:76,tsel:"NUST NET (Engineering & Computing)",city:"Lahore, Punjab",fee:"PKR 120,000 / semester",uni:"",hostel:true,schol:true,tab:"all",cp:0,sim:78,goal:80,q:"Lahore Computer Science",deg:"bs",shift:"Morning Shift",feeR:"100-150",rad:"25km",sector:"All Sectors",fSch:true,fHost:true,fBus:false,sort:"chance",layout:"list",cmp:["fast","itu","cui"],page:1,touched:{},dock:true};

const EXPLORE_KEYS = ["q","deg","feeR","fSch","fHost","fBus","sort"];
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

function load() {
  try { return Object.assign({}, D, JSON.parse(localStorage.getItem("msf") || "{}")); }
  catch (e) { return { ...D }; }
}

export function go(r) { location.hash = "#/" + r; }

export function StoreProvider({ children }) {
  const [S, setS] = useState(load);
  useEffect(() => { try { localStorage.setItem("msf", JSON.stringify(S)); } catch (e) {} }, [S]);

  const set = (patch) => setS((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));

  // text / number / checkbox / radio / select inputs
  const setField = (k, v) => set((s) => {
    const n = { [k]: v };
    if (EXPLORE_KEYS.indexOf(k) > -1) { n.touched = { ...s.touched, [k]: 1 }; n.page = 1; }
    return n;
  });

  // segmented buttons
  const pick = (g, v) => set((s) => {
    const n = { [g]: g === "goal" ? Number(v) : v, page: 1 };
    if (g === "sector" || g === "rad") n.touched = { ...s.touched, [g === "rad" ? "rad" : "sector"]: 1 };
    return n;
  });

  return <Ctx.Provider value={{ S, set, setField, pick }}>{children}</Ctx.Provider>;
}
