import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Wallet, Award, GitCompareArrows, Calculator, ChevronDown, ChevronUp, TrendingUp, Check } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { fmt, fmtPKR, formulaLabel } from '../lib/merit.js';
import { BucketBadge } from './ui.jsx';
import TrendSpark from './TrendSpark.jsx';

export default function ProgramCard({ item }) {
  const nav = useNavigate();
  const { profile, compare, toggleCompare, setSelectedId } = useProfile();
  const [open, setOpen] = useState(false);
  const inCompare = compare.includes(item.id);
  const full = compare.length >= 5 && !inCompare;
  const over = item.budgetGap > 0;

  const openFormula = () => { setSelectedId(item.id); nav('/calculator'); };

  return (
    <article className={`pcard ${item.bucket.toLowerCase()}`}>
      <div className="pcard-head">
        <div>
          <div className="uni">{item.uni} <span className="muted small">· {item.campus}</span></div>
          <div className="muted small">{item.program} · {item.kind}</div>
        </div>
        <BucketBadge bucket={item.bucket} chance={item.chance} />
      </div>

      <div className="metrics">
        <div className="metric"><span className="k">Your aggregate</span><span className="v">{fmt(item.agg)}%</span><span className="s">{formulaLabel(item.formula)}</span></div>
        <div className="metric"><span className="k">Closing 2024</span><span className="v">{fmt(item.closing[2024])}%</span><span className="s">{item.diff >= 0 ? '+' : ''}{fmt(item.diff)}% margin</span></div>
        <div className="metric"><span className="k">Tuition / sem</span><span className="v">{fmtPKR(item.fee)}</span><span className="s" style={{ color: over ? 'var(--reach)' : 'var(--safe)' }}>{over ? `Over budget by ${fmtPKR(item.budgetGap)}` : 'Within budget'}</span></div>
        <div className="metric"><span className="k">Distance</span><span className="v">{item.distance} km</span><span className="s">{item.hostel ? 'Hostel available' : 'No hostel'}</span></div>
      </div>

      <div className="row">
        {item.sch && <span className="badge b-amber"><Award size={13} /> {item.sch.label}</span>}
        {item.elig.status === 'Conditional' && <span className="badge b-amber">Conditionally eligible</span>}
        {item.hostel && <span className="badge b-muted"><BedDouble size={13} /> Hostel</span>}
        <span className="badge b-muted"><TrendingUp size={13} /> {item.trend >= 0 ? '+' : ''}{fmt(item.trend)}% over 2 yrs</span>
      </div>

      <div className="row between">
        <div className="row">
          <button className={`btn btn-sm btn-ghost ${inCompare ? 'on' : ''}`} onClick={() => toggleCompare(item.id)} disabled={full} title={full ? 'You can compare up to 5' : ''}>
            {inCompare ? <Check size={15} /> : <GitCompareArrows size={15} />} {inCompare ? 'In comparison' : 'Compare'}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={openFormula}><Calculator size={15} /> Marks needed</button>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => setOpen((o) => !o)}>
          Why this result? {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {open && (
        <div className="why">
          <div className="kv"><span>Eligibility</span><b>{item.elig.status}</b></div>
          <div className="muted small" style={{ marginBottom: 6 }}>{item.elig.reason}</div>
          <div className="kv"><span>Formula</span><b>{formulaLabel(item.formula)}</b></div>
          <div className="kv"><span>Aggregate vs closing</span><b>{fmt(item.agg)}% vs {fmt(item.closing[2024])}%</b></div>
          <div className="kv"><span>Entry test</span><b>{item.testName} · {item.testDate}</b></div>
          <div className="kv"><span><Wallet size={13} style={{ verticalAlign: -2 }} /> Fee vs your budget</span><b>{fmtPKR(item.fee)} vs {fmtPKR(profile.maxFee)}</b></div>
          <div className="kv"><span><MapPin size={13} style={{ verticalAlign: -2 }} /> Distance</span><b>{item.distance} km from Lahore</b></div>
          <div style={{ marginTop: 10 }}><TrendSpark closing={item.closing} agg={item.agg} /></div>
        </div>
      )}
    </article>
  );
}
