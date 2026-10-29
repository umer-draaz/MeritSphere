import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { aggregate, bucketOf, chanceFromDiff, difficulty, fmt, formulaLabel, requiredTest, securedPoints } from '../lib/merit.js';
import { BucketBadge } from '../components/ui.jsx';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export default function Calculator() {
  const { profile, derived, results, selectedId, setSelectedId } = useProfile();
  const [sim, setSim] = useState(profile.testScore);
  const [goal, setGoal] = useState(80);

  const prog = results.find((r) => r.id === selectedId) ?? results[0];
  const f = prog.formula;
  const closing = prog.closing[2024];
  const secured = securedPoints(prog, derived);
  const required = requiredTest(prog, derived);
  const hasTest = f.test > 0;

  const simAgg = secured + (f.test * sim) / 100;
  const simDiff = simAgg - closing;
  const simBucket = bucketOf(chanceFromDiff(simDiff));
  const tone = simBucket.toLowerCase();

  const feasibility = !hasTest
    ? { icon: <XCircle size={18} />, title: 'No entry-test weight', body: 'This program does not use an entry test, so your marks are already fixed.', tone: 'target' }
    : required > 100
      ? { icon: <XCircle size={18} />, title: 'Not possible', body: `You would need ${fmt(required)}% in the test, which is above 100%.`, tone: 'reach' }
      : required <= 0
        ? { icon: <CheckCircle2 size={18} />, title: 'Already secured', body: 'Your Inter and Matric marks alone meet last year’s closing merit.', tone: 'safe' }
        : { icon: <CheckCircle2 size={18} />, title: 'Feasible', body: `You need at least ${fmt(required)}% in ${prog.testName} to reach last year’s closing merit.`, tone: required >= 90 ? 'reach' : required >= 75 ? 'target' : 'safe' };

  const scenarios = [
    { label: 'Minimum needed', score: hasTest && required > 0 && required <= 100 ? required : null },
    { label: 'Pessimistic', score: 70 },
    { label: 'Optimistic', score: 85 },
  ].map((s) => {
    if (s.score == null) return { ...s, agg: null };
    const agg = secured + (f.test * s.score) / 100;
    const b = bucketOf(chanceFromDiff(agg - closing));
    return { ...s, agg, bucket: b };
  });

  // Required test score across the nearest programs (≤ 25 km, with a test component)
  const compareRows = results
    .filter((r) => r.distance <= 25 && r.formula.test > 0)
    .map((r) => ({ r, req: requiredTest(r, derived) }))
    .sort((a, b) => a.req - b.req)
    .slice(0, 5);

  // "If I score X%, where can I get in?"
  const viable = results
    .filter((r) => r.elig.status !== 'Not eligible' && r.formula.test > 0)
    .map((r) => {
      const agg = aggregate(r, { ...derived, testPct: goal });
      const diff = agg - r.closing[2024];
      return { r, agg, diff, bucket: bucketOf(chanceFromDiff(diff)) };
    })
    .filter((x) => x.diff >= 0)
    .sort((a, b) => b.diff - a.diff);

  const pointsNeeded = closing - secured;

  return (
    <>
      <section className="hero">
        <h1>What marks do I need in the <span className="hl">entry test</span>?</h1>
        <p>Pick a program, then move the slider to see how your test score changes your aggregate.</p>
      </section>

      <div className="grid-side">
        <div className="stack">
          {/* Step 1 */}
          <section className="card stack">
            <h2>1. Choose a program</h2>
            <select className="select" value={prog.id} onChange={(e) => setSelectedId(e.target.value)} aria-label="Program">
              {results.map((r) => <option key={r.id} value={r.id}>{r.short} {r.campus.split(',')[0]} – {r.program}</option>)}
            </select>
            <div className="formula-box">{formulaLabel(f)} · closing 2024: {fmt(closing)}%</div>
            <div className="two">
              <div className="metric"><span className="k">Points secured (known marks)</span><span className="v">{fmt(secured)}</span><span className="s">Inter {fmt(derived.interPct)}%{f.matric > 0 ? ` · Matric ${fmt(derived.matricPct)}%` : ''}</span></div>
              <div className="metric"><span className="k"><Lock size={11} style={{ verticalAlign: -1 }} /> Test points pending</span><span className="v">{fmt(f.test)}</span><span className="s">out of {f.test} max</span></div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="card stack">
            <div className="range-head">
              <h2>2. Try an entry-test score</h2>
              <span className="big-num">{sim} / 100</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={sim} onChange={(e) => setSim(Number(e.target.value))} aria-label="Simulated test score" disabled={!hasTest} />
            <div className={`verdict ${tone}`}>
              <div className="row between">
                <b>Simulated aggregate: {fmt(simAgg)}%</b>
                <BucketBadge bucket={simBucket} />
              </div>
              <span className="small">
                {simDiff >= 0 ? `That is ${fmt(simDiff)}% above` : `That is ${fmt(Math.abs(simDiff))}% below`} the 2024 closing merit of {fmt(closing)}%. This is an estimate, not a guarantee.
              </span>
            </div>

            <div className="scen">
              {scenarios.map((s) => (
                <div key={s.label}>
                  <span className="small muted">{s.label}</span>
                  <span className="v">{s.score == null ? 'N/A' : `${fmt(s.score, 1)}%`}</span>
                  {s.agg != null && <span className="small">Aggregate {fmt(s.agg)}%</span>}
                  {s.bucket && <span className={`badge b-${s.bucket.toLowerCase()}`} style={{ width: 'fit-content' }}>{s.bucket}</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Goal inversion */}
          <section className="card stack">
            <h2>3. If I score this, where can I get in?</h2>
            <div className="pills">
              {[70, 75, 80, 85, 90].map((g) => (
                <button key={g} className={`pill ${goal === g ? 'on' : ''}`} onClick={() => setGoal(g)}>{g}%</button>
              ))}
            </div>
            <p className="muted small">{viable.length} program{viable.length === 1 ? '' : 's'} within reach with {goal}% in the entry test.</p>
            <div>
              {viable.length === 0 && <p className="muted">No programs reach last year’s closing merit at this score.</p>}
              {viable.map(({ r, agg, diff, bucket }) => (
                <div className="list-row" key={r.id}>
                  <div>
                    <b>{r.short} · {r.program}</b>
                    <div className="muted small">Aggregate {fmt(agg)}% · cutoff {fmt(r.closing[2024])}% · +{fmt(diff)}%</div>
                  </div>
                  <span className={`badge b-${bucket.toLowerCase()}`}>{bucket}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="stack sticky">
          <div className={`card verdict ${feasibility.tone}`} style={{ border: 0 }}>
            <div className="row" style={{ gap: 8 }}>{feasibility.icon}<b>{feasibility.title}</b></div>
            <span className="small">{feasibility.body}</span>
            {hasTest && required > 0 && required <= 100 && (
              <span className="small">Gap to close: <b>{fmt(pointsNeeded)}</b> of {f.test} test points.</span>
            )}
          </div>

          <div className="card stack" style={{ gap: 8 }}>
            <h3>Test score needed nearby</h3>
            <p className="muted small">Programs within 25 km, easiest first.</p>
            <div>
              {compareRows.map(({ r, req }) => {
                const d = difficulty(req);
                return (
                  <div className="list-row" key={r.id}>
                    <div>
                      <b>{r.short}</b> <span className="muted small">{r.program.replace('BS ', '')}</span>
                      <div className={`small`} style={{ color: `var(--${d.tone === 'muted' ? 'muted' : d.tone})` }}>{d.label}</div>
                    </div>
                    <b>{req > 100 ? '>100' : fmt(Math.max(0, req), 1)}%</b>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card stack" style={{ gap: 8 }}>
            <h3>The formula</h3>
            <div className="formula-box">Needed test % = (Closing − known points) ÷ test weight</div>
            <p className="muted small">Uses open-merit seats only. Past closing merit moves roughly −0.4% to +0.8% each year.</p>
            <Link to="/explore" className="btn btn-ghost btn-sm">Compare programs <ArrowRight size={15} /></Link>
          </div>
        </aside>
      </div>
    </>
  );
}
