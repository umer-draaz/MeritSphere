import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, RotateCcw, LayoutList, LayoutGrid, X, Download } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { fmt, fmtPKR } from '../lib/merit.js';
import { BucketBadge, PillGroup, Toggle } from '../components/ui.jsx';
import ProgramCard from '../components/ProgramCard.jsx';

const FEE_OPTIONS = [
  { value: 0, label: 'Any fee' },
  { value: 50000, label: 'Under PKR 50,000' },
  { value: 100000, label: 'Under PKR 100,000' },
  { value: 150000, label: 'Under PKR 150,000' },
];
const RADIUS = [
  { value: 5, label: '5 km' }, { value: 15, label: '15 km' }, { value: 25, label: '25 km' },
  { value: 50, label: '50 km' }, { value: 0, label: 'All Pakistan' },
];
const SECTORS = [{ value: 'All', label: 'All' }, { value: 'Public', label: 'Public' }, { value: 'Private', label: 'Private' }];
const SORTS = [
  { value: 'chance', label: 'Admission chance' },
  { value: 'fee', label: 'Lowest fee' },
  { value: 'distance', label: 'Nearest' },
  { value: 'merit', label: 'Highest closing merit' },
];
const DEFAULT = { q: '', feeMax: 0, radius: 0, sector: 'All', hostel: false, sch: false, sort: 'chance' };

export default function Explore() {
  const nav = useNavigate();
  const loc = useLocation();
  const { results, compare, toggleCompare, clearCompare, setSelectedId } = useProfile();
  const [f, setF] = useState({ ...DEFAULT, ...(loc.state || {}) });
  const [view, setView] = useState('list');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const out = results
      .filter((r) => r.elig.status !== 'Not eligible')
      .filter((r) => !q || `${r.uni} ${r.short} ${r.program} ${r.campus}`.toLowerCase().includes(q))
      .filter((r) => !f.feeMax || r.fee <= f.feeMax)
      .filter((r) => !f.radius || r.distance <= f.radius)
      .filter((r) => f.sector === 'All' || r.sector === f.sector)
      .filter((r) => !f.hostel || r.hostel)
      .filter((r) => !f.sch || r.sch);
    const by = {
      chance: (a, b) => b.chance - a.chance,
      fee: (a, b) => a.fee - b.fee,
      distance: (a, b) => a.distance - b.distance,
      merit: (a, b) => b.closing[2024] - a.closing[2024],
    }[f.sort];
    return [...out].sort(by);
  }, [results, f]);

  const picked = compare.map((id) => results.find((r) => r.id === id)).filter(Boolean);
  const bestOf = (key, dir) => {
    if (picked.length < 2) return null;
    return picked.reduce((a, b) => (dir === 'max' ? (b[key] > a[key] ? b : a) : (b[key] < a[key] ? b : a))).id;
  };
  const bests = { chance: bestOf('chance', 'max'), fee: bestOf('fee', 'min'), distance: bestOf('distance', 'min'), diff: bestOf('diff', 'max') };

  return (
    <>
      <section className="hero">
        <h1>Explore and <span className="hl">compare</span> programs</h1>
        <p>Filter by fee, distance and sector, then pick up to five programs to compare side by side.</p>
      </section>

      {picked.length > 0 && (
        <section className="card stack" id="compare">
          <div className="row between">
            <div>
              <h2>Comparison ({picked.length}/5)</h2>
              <p className="muted small">Green cells are the best value in each row.{picked.length < 2 ? ' Add one more program to see the best values.' : ''}</p>
            </div>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => window.print()}><Download size={15} /> Export PDF</button>
              <button className="btn btn-sm btn-ghost" onClick={clearCompare}>Clear all</button>
            </div>
          </div>
          <div className="table-wrap">
            <table className="cmp">
              <thead>
                <tr>
                  <th className="k">Program</th>
                  {picked.map((r) => (
                    <th key={r.id}>
                      <div className="row between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                        <div>{r.short}<div className="muted small" style={{ fontWeight: 400 }}>{r.program}</div></div>
                        <button className="x-btn" onClick={() => toggleCompare(r.id)} aria-label={`Remove ${r.short}`}><X size={16} /></button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td className="k">Admission chance</td>{picked.map((r) => <td key={r.id} className={bests.chance === r.id ? 'best' : ''}><BucketBadge bucket={r.bucket} chance={r.chance} /></td>)}</tr>
                <tr><td className="k">Your aggregate</td>{picked.map((r) => <td key={r.id}>{fmt(r.agg)}%</td>)}</tr>
                <tr><td className="k">Closing merit 2024</td>{picked.map((r) => <td key={r.id}>{fmt(r.closing[2024])}%</td>)}</tr>
                <tr><td className="k">Safety margin</td>{picked.map((r) => <td key={r.id} className={bests.diff === r.id ? 'best' : ''}>{r.diff >= 0 ? '+' : ''}{fmt(r.diff)}%</td>)}</tr>
                <tr><td className="k">Tuition / semester</td>{picked.map((r) => <td key={r.id} className={bests.fee === r.id ? 'best' : ''}>{fmtPKR(r.fee)}</td>)}</tr>
                <tr><td className="k">Distance</td>{picked.map((r) => <td key={r.id} className={bests.distance === r.id ? 'best' : ''}>{r.distance} km</td>)}</tr>
                <tr><td className="k">Scholarship</td>{picked.map((r) => <td key={r.id}>{r.sch ? r.sch.label : r.scholarship ? `Needs ${r.scholarship.minAgg}%+` : 'None listed'}</td>)}</tr>
                <tr><td className="k">Entry test</td>{picked.map((r) => <td key={r.id}>{r.testName}<div className="muted small">{r.testDate}</div></td>)}</tr>
                <tr><td className="k" />{picked.map((r) => (
                  <td key={r.id}><button className="btn btn-sm btn-ghost" onClick={() => { setSelectedId(r.id); nav('/calculator'); }}>Marks needed</button></td>
                ))}</tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid-side" style={{ gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)' }}>
        {/* Filters */}
        <aside className="card stack sticky">
          <div className="row between">
            <h2>Filters</h2>
            <button className="btn btn-sm btn-ghost" onClick={() => setF(DEFAULT)}><RotateCcw size={14} /> Reset</button>
          </div>
          <div className="field">
            <label className="label" htmlFor="q">Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--soft)' }} />
              <input id="q" className="input" style={{ paddingLeft: 38 }} placeholder="University or program" value={f.q} onChange={(e) => set('q', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="fee">Fee per semester</label>
            <select id="fee" className="select" value={f.feeMax} onChange={(e) => set('feeMax', Number(e.target.value))}>
              {FEE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="field"><span className="label">Distance from Lahore</span><PillGroup options={RADIUS} value={f.radius} onChange={(v) => set('radius', v)} /></div>
          <div className="field"><span className="label">Sector</span><PillGroup options={SECTORS} value={f.sector} onChange={(v) => set('sector', v)} /></div>
          <Toggle label="Hostel available" checked={f.hostel} onChange={(v) => set('hostel', v)} />
          <Toggle label="Scholarship I qualify for" checked={f.sch} onChange={(v) => set('sch', v)} />
          <div className="field">
            <label className="label" htmlFor="sort">Sort by</label>
            <select id="sort" className="select" value={f.sort} onChange={(e) => set('sort', e.target.value)}>
              {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </aside>

        {/* List */}
        <section className="stack">
          <div className="row between">
            <h2>{list.length} matching program{list.length === 1 ? '' : 's'}</h2>
            <div className="row" style={{ gap: 6 }}>
              <button className={`btn btn-sm btn-ghost ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')} aria-label="List view"><LayoutList size={16} /></button>
              <button className={`btn btn-sm btn-ghost ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid size={16} /></button>
            </div>
          </div>
          {list.length === 0 ? (
            <div className="card empty">
              <h3>No programs match these filters</h3>
              <p className="small">Try a bigger distance or a higher fee limit.</p>
              <button className="btn btn-primary btn-sm" onClick={() => setF(DEFAULT)}>Reset filters</button>
            </div>
          ) : (
            <div className={`pgrid ${view}`}>{list.map((r) => <ProgramCard key={r.id} item={r} />)}</div>
          )}
          <p className="muted small">Want to change your marks? <Link to="/" className="hl" style={{ fontWeight: 600 }}>Edit inputs</Link></p>
        </section>
      </div>
    </>
  );
}
