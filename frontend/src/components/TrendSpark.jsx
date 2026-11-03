// Tiny SVG chart: closing merit for 2022–2024 plus the student's aggregate as a dashed line.
export default function TrendSpark({ closing, agg }) {
  const years = [2022, 2023, 2024];
  const vals = years.map((y) => closing[y]);
  const all = [...vals, agg];
  const min = Math.min(...all) - 1.5;
  const max = Math.max(...all) + 1.5;
  const W = 260, H = 90, padX = 26, padY = 14;
  const x = (i) => padX + (i * (W - padX * 2)) / 2;
  const y = (v) => H - padY - ((v - min) / (max - min)) * (H - padY * 2);
  const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }} role="img" aria-label="Closing merit trend">
      <line x1={padX} x2={W - padX} y1={y(agg)} y2={y(agg)} stroke="#5b3df5" strokeDasharray="5 4" strokeWidth="1.5" />
      <text x={W - padX} y={y(agg) - 5} textAnchor="end" fontSize="9.5" fill="#5b3df5" fontWeight="600">You {agg.toFixed(1)}%</text>
      <polyline points={pts} fill="none" stroke="#15133f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {vals.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="4" fill="#fff" stroke="#15133f" strokeWidth="2" />
          <text x={x(i)} y={H - 1} textAnchor="middle" fontSize="9.5" fill="#8a88a8">{years[i]}</text>
          <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize="9.5" fill="#15133f" fontWeight="600">{v.toFixed(1)}</text>
        </g>
      ))}
    </svg>
  );
}
