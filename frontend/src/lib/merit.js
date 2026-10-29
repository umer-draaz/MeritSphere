// All merit maths lives here so it can later be swapped for an API call.

export const pct = (obtained, total) => (total > 0 ? (obtained / total) * 100 : 0);
export const fmt = (n, d = 2) => Number(n).toFixed(d);
export const fmtPKR = (n) => 'PKR ' + Math.round(n).toLocaleString('en-US');

export function aggregate(program, p) {
  const f = program.formula;
  return (f.matric * p.matricPct + f.inter * p.interPct + f.test * p.testPct) / 100;
}

// Points already secured from marks that are known (everything except the entry test).
export function securedPoints(program, p) {
  const f = program.formula;
  return (f.matric * p.matricPct + f.inter * p.interPct) / 100;
}

// Entry-test % needed to reach a target aggregate. null = formula has no test component.
export function requiredTest(program, p, target = program.closing[2024]) {
  const f = program.formula;
  if (f.test === 0) return null;
  return (target - securedPoints(program, p)) / (f.test / 100);
}

export function chanceFromDiff(diff) {
  const c = 100 / (1 + Math.exp(-(diff + 2.5) / 2.2));
  return Math.min(99, Math.max(1, Math.round(c)));
}

export const bucketOf = (chance) => (chance >= 85 ? 'Safe' : chance >= 60 ? 'Target' : 'Reach');

export function eligibility(program, group) {
  if (group === 'Pre-Engineering' || group === 'ICS') return { status: 'Eligible', reason: 'Your group meets the subject requirements.' };
  if (group === 'Pre-Medical') return { status: 'Conditional', reason: 'Mathematics deficiency course required in the first year.' };
  return { status: 'Not eligible', reason: 'Mathematics is missing from your intermediate group.' };
}

export function formulaLabel(f) {
  return [
    f.matric > 0 && `${f.matric}% Matric`,
    f.inter > 0 && `${f.inter}% Inter`,
    f.test > 0 && `${f.test}% Entry test`,
  ].filter(Boolean).join(' + ');
}

export function evaluateAll(programs, p) {
  return programs.map((pr) => {
    const agg = aggregate(pr, p);
    const diff = agg - pr.closing[2024];
    const chance = chanceFromDiff(diff);
    return {
      ...pr,
      agg,
      diff,
      chance,
      bucket: bucketOf(chance),
      elig: eligibility(pr, p.group),
      budgetGap: pr.fee - p.maxFee,
      sch: pr.scholarship && agg >= pr.scholarship.minAgg ? pr.scholarship : null,
      trend: pr.closing[2024] - pr.closing[2022],
    };
  });
}

export function difficulty(required) {
  if (required == null) return { label: 'No test weight', tone: 'muted' };
  if (required > 100) return { label: 'Not possible', tone: 'reach' };
  if (required >= 90) return { label: 'Very hard', tone: 'reach' };
  if (required >= 75) return { label: 'Achievable', tone: 'target' };
  return { label: 'Comfortable', tone: 'safe' };
}
