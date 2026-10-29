import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Download, Calculator, Info } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { STAGES } from '../data/programs.js';
import { fmt, fmtPKR } from '../lib/merit.js';
import ProgramCard from '../components/ProgramCard.jsx';

export default function Results() {
  const nav = useNavigate();
  const loc = useLocation();
  const { profile, derived, results, setSelectedId } = useProfile();
  const [tab, setTab] = useState(loc.state?.tab ?? (profile.scholarships ? 'scholarships' : 'all'));

  const notEligible = results.filter((r) => r.elig.status === 'Not eligible');
  const eligible = results.filter((r) => r.elig.status !== 'Not eligible');
  const noHostel = profile.hostel ? eligible.filter((r) => !r.hostel) : [];
  const pool = eligible.filter((r) => !profile.hostel || r.hostel);

  const count = (b) => pool.filter((r) => r.bucket === b).length;
  const tabs = [
    { id: 'all', label: `All (${pool.length})` },
    { id: 'Safe', label: `Safe (${count('Safe')})` },
    { id: 'Target', label: `Target (${count('Target')})` },
    { id: 'Reach', label: `Reach (${count('Reach')})` },
    { id: 'scholarships', label: `Scholarships (${pool.filter((r) => r.sch).length})` },
  ];
  const shown = pool
    .filter((r) => (tab === 'all' ? true : tab === 'scholarships' ? !!r.sch : r.bucket === tab))
    .sort((a, b) => b.chance - a.chance);

  const best = pool.length ? [...pool].sort((a, b) => b.agg - a.agg)[0] : null;
  const stageLabel = STAGES.find((s) => s.value === profile.stage)?.label;
  const w = { matric: 0, inter: 50, test: 50 };

  return (
    <>
      {/* Student summary */}
      <section className="card" style={{ padding: 18 }}>
        <div className="row between">
          <div className="row">
            <span className="badge b-muted">{stageLabel} · {profile.group}</span>
            <span className="badge b-safe">Inter {fmt(derived.interPct)}% · Final</span>
            <span className="badge b-target">Test {profile.testScore}% · {profile.testMode === 'assumed' ? 'Estimate' : 'Actual'}</span>
            <span className="badge b-amber">Max fee {fmtPKR(profile.maxFee)}</span>
            {profile.hostel && <span className="badge b-muted">Hostel needed</span>}
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => window.print()}><Download size={15} /> Export PDF</button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat grad"><span className="k">Your best aggregate</span><span className="v">{best ? fmt(best.agg) : '—'}%</span><span className="s">{best ? `${best.short} ${best.program.replace('BS ', '')}` : 'No programs'}</span></div>
        <div className="stat"><span className="k">Safe</span><span className="v" style={{ color: 'var(--safe)' }}>{count('Safe')}</span><span className="s">85%+ chance</span></div>
        <div className="stat"><span className="k">Target</span><span className="v" style={{ color: 'var(--target)' }}>{count('Target')}</span><span className="s">60–84% chance</span></div>
        <div className="stat"><span className="k">Reach</span><span className="v" style={{ color: 'var(--reach)' }}>{count('Reach')}</span><span className="s">Below 60%</span></div>
      </section>

      <div className="grid-side">
        <section className="stack">
          <div className="tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="card empty">
              <Info size={28} />
              <h3>No programs match this view</h3>
              <p className="small">Try another tab, raise your fee limit, or turn off the hostel filter.</p>
              <Link to="/" className="btn btn-primary btn-sm">Edit inputs</Link>
            </div>
          ) : (
            <div className="pgrid">{shown.map((r) => <ProgramCard key={r.id} item={r} />)}</div>
          )}

          {(notEligible.length > 0 || noHostel.length > 0) && (
            <p className="muted small">
              {notEligible.length > 0 && <>{notEligible.length} programs hidden: {notEligible[0].elig.reason} </>}
              {noHostel.length > 0 && <>{noHostel.length} hidden because they have no hostel.</>}
            </p>
          )}
        </section>

        <aside className="stack sticky">
          <div className="card stack" style={{ gap: 12 }}>
            <h3>How we calculate</h3>
            <p className="muted small">Each program card uses that university's own weights. Example (50/50 programs):</p>
            <div>
              <div className="kv"><span>Inter ({fmt(derived.interPct)}%)</span><b>{w.inter}%</b></div>
              <div className="kv"><span>Entry test ({profile.testScore}%)</span><b>{w.test}%</b></div>
              <div className="kv"><span>Aggregate</span><b>{fmt(derived.interPct * 0.5 + derived.testPct * 0.5)}%</b></div>
            </div>
          </div>

          <div className="card stack" style={{ gap: 10, background: 'var(--g-hero)' }}>
            <h3>What if I score higher?</h3>
            <p className="muted small">See how extra entry-test marks change your chances.</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSelectedId(best?.id ?? 'fast-cs'); nav('/calculator'); }}>
              <Calculator size={15} /> Open simulator
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
