import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, Search, Award, Sparkles } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { GROUPS, STAGES, TEST_OPTIONS } from '../data/programs.js';
import { fmt, fmtPKR } from '../lib/merit.js';
import { PillGroup, Toggle } from '../components/ui.jsx';

export default function Navigator() {
  const nav = useNavigate();
  const { profile, setField, derived, results, setSelectedId } = useProfile();

  // Live preview uses a simple reference formula: 50% Inter + 50% entry test.
  const interPts = derived.interPct * 0.5;
  const testPts = derived.testPct * 0.5;
  const refAgg = interPts + testPts;

  const open = results.filter((r) => r.elig.status !== 'Not eligible' && (!profile.hostel || r.hostel));
  const count = (b) => open.filter((r) => r.bucket === b).length;
  const schCount = open.filter((r) => r.sch).length;

  const launchers = [
    {
      icon: <Calculator size={16} />, text: 'What entry-test marks do I need for FAST CS?',
      go: () => { setSelectedId('fast-cs'); nav('/calculator'); },
    },
    {
      icon: <Search size={16} />, text: 'Find Software Engineering under PKR 100k per semester',
      go: () => nav('/explore', { state: { q: 'Software', feeMax: 100000 } }),
    },
    {
      icon: <Award size={16} />, text: 'Show scholarships I qualify for with my marks',
      go: () => nav('/results', { state: { tab: 'scholarships' } }),
    },
  ];

  return (
    <>
      <section className="hero">
        <h1>Stop <span className="hl">guessing</span>. Start getting in.</h1>
        <p>Your smart guide to university admissions, merit calculations, admission chances, and personalized recommendations across Pakistan.</p>
      </section>

      <div className="grid-2">
        {/* ---------------- Form ---------------- */}
        <section className="card stack" style={{ gap: 22 }}>
          <div>
            <h2>Your academic details</h2>
            <p className="muted small">Step 1 of 2 · changes update the preview instantly</p>
          </div>

          <div className="field">
            <span className="label">Academic status</span>
            <PillGroup options={STAGES} value={profile.stage} onChange={(v) => setField('stage', v)} />
          </div>

          <div className="field">
            <span className="label">Intermediate group</span>
            <PillGroup options={GROUPS} value={profile.group} onChange={(v) => setField('group', v)} />
          </div>

          <div className="two">
            <div className="field">
              <label className="label" htmlFor="matric">Matric percentage</label>
              <input id="matric" type="number" step="0.1" className={`input ${derived.errors.matric ? 'bad' : ''}`}
                value={profile.matricPct} onChange={(e) => setField('matricPct', Number(e.target.value))} />
              {derived.errors.matric && <span className="err">{derived.errors.matric}</span>}
            </div>
            <div className="field">
              <span className="label">Inter Part 1 marks</span>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <input aria-label="Marks obtained" type="number" className={`input ${derived.errors.inter ? 'bad' : ''}`}
                  value={profile.interObtained} onChange={(e) => setField('interObtained', Number(e.target.value))} />
                <span className="muted">/</span>
                <input aria-label="Total marks" type="number" className="input"
                  value={profile.interTotal} onChange={(e) => setField('interTotal', Number(e.target.value))} />
              </div>
              {derived.errors.inter
                ? <span className="err">{derived.errors.inter}</span>
                : <span className="hint">= {fmt(derived.interPct)}% · <span style={{ color: 'var(--safe)', fontWeight: 600 }}>Final</span></span>}
            </div>
          </div>

          <div className="divider" />

          <div className="field">
            <span className="label">Entry test</span>
            <PillGroup
              options={[{ value: 'taken', label: 'Test taken' }, { value: 'assumed', label: 'Assumed / target score' }]}
              value={profile.testMode} onChange={(v) => setField('testMode', v)} />
            <select className="select" value={profile.testName} onChange={(e) => setField('testName', e.target.value)} aria-label="Admission test">
              {TEST_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <div className="range-head">
              <span className="hint">{profile.testMode === 'assumed' ? 'Treated as an estimate in every result' : 'Your actual score'}</span>
              <span className="big-num">{profile.testScore} / 100</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={profile.testScore} onChange={(e) => setField('testScore', Number(e.target.value))} aria-label="Entry test score" />
          </div>

          <div className="divider" />

          <div className="field">
            <div className="range-head">
              <span className="label">Max fee per semester</span>
              <span className="big-num">{fmtPKR(profile.maxFee)}</span>
            </div>
            <input type="range" min="30000" max="400000" step="5000" value={profile.maxFee} onChange={(e) => setField('maxFee', Number(e.target.value))} aria-label="Max fee" />
            <span className="hint">Distances are measured from Lahore in this demo.</span>
          </div>

          <div className="two">
            <Toggle label="I need a hostel" checked={profile.hostel} onChange={(v) => setField('hostel', v)} />
            <Toggle label="Show scholarships first" checked={profile.scholarships} onChange={(v) => setField('scholarships', v)} />
          </div>

          <button className="btn btn-primary btn-block" disabled={!derived.valid}
            onClick={() => nav('/results', { state: profile.scholarships ? { tab: 'scholarships' } : undefined })}>
            See my results <ArrowRight size={18} />
          </button>
        </section>

        {/* ---------------- Live preview ---------------- */}
        <aside className="stack sticky">
          <div className="card agg-card">
            <div className="sub">Estimated aggregate · 50% Inter + 50% entry test</div>
            <div className="num">{fmt(refAgg)}%</div>
            <div className="row" style={{ marginTop: 10 }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>Inter {fmt(interPts)} pts</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>
                Test {fmt(testPts)} pts{profile.testMode === 'assumed' ? ' (estimate)' : ''}
              </span>
            </div>
          </div>

          <div className="card stack" style={{ gap: 14 }}>
            <h3>Where you stand</h3>
            <div className="mini-grid">
              <div className="mini safe"><span className="v">{count('Safe')}</span><span className="k">Safe</span></div>
              <div className="mini target"><span className="v">{count('Target')}</span><span className="k">Target</span></div>
              <div className="mini reach"><span className="v">{count('Reach')}</span><span className="k">Reach</span></div>
            </div>
            <p className="muted small">{schCount} program{schCount === 1 ? '' : 's'} with a scholarship you may qualify for.</p>
          </div>

          <div className="stack" style={{ gap: 10 }}>
            <h3>Quick questions</h3>
            {launchers.map((l) => (
              <button key={l.text} className="launch" onClick={l.go}>
                <span className="row" style={{ flexWrap: 'nowrap' }}><span className="ic">{l.icon}</span>{l.text}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
