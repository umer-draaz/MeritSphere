export function PillGroup({ options, value, onChange }) {
  return (
    <div className="pills">
      {options.map((o) => (
        <button key={o.value} type="button" className={`pill ${value === o.value ? 'on' : ''}`} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

const TONE = { Safe: 'b-safe', Target: 'b-target', Reach: 'b-reach' };
export const bucketClass = (b) => TONE[b] || 'b-muted';

export function BucketBadge({ bucket, chance }) {
  return <span className={`badge ${bucketClass(bucket)}`}>{bucket}{chance != null ? ` • ${chance}%` : ''}</span>;
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
