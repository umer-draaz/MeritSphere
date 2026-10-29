// Demo dataset (no backend). Replace with API data later – keep the same shape.
// formula = weights in % (must total 100). closing = closing merit % per year.
// scholarship.minAgg = minimum aggregate needed to qualify.

export const PROGRAMS = [
  {
    id: 'fast-cs', uni: 'FAST-NUCES', short: 'FAST', campus: 'Lahore Campus', program: 'BS Computer Science',
    sector: 'Private', kind: 'Chartered Federal', fee: 135000, distance: 8.4, hostel: true,
    closing: { 2024: 83.1, 2023: 82.8, 2022: 81.9 },
    formula: { matric: 0, inter: 50, test: 50 }, testName: 'NU Test', testDate: 'Jul 8 – 19',
    scholarship: null,
  },
  {
    id: 'fast-se', uni: 'FAST-NUCES', short: 'FAST', campus: 'Lahore Campus', program: 'BS Software Engineering',
    sector: 'Private', kind: 'Chartered Federal', fee: 135000, distance: 8.4, hostel: true,
    closing: { 2024: 82.4, 2023: 82.1, 2022: 81.5 },
    formula: { matric: 0, inter: 50, test: 50 }, testName: 'NU Test', testDate: 'Jul 8 – 19',
    scholarship: null,
  },
  {
    id: 'itu-se', uni: 'Information Technology University', short: 'ITU', campus: 'Arfa Software Tech Park', program: 'BS Software Engineering',
    sector: 'Public', kind: 'Punjab Govt Chartered', fee: 110000, distance: 5.2, hostel: false,
    closing: { 2024: 78.5, 2023: 77.9, 2022: 76.8 },
    formula: { matric: 15, inter: 35, test: 50 }, testName: 'ITU Admissions Test', testDate: 'Jul 14',
    scholarship: { label: '50% merit waiver', minAgg: 80 },
  },
  {
    id: 'itu-cs', uni: 'Information Technology University', short: 'ITU', campus: 'Arfa Software Tech Park', program: 'BS Computer Science',
    sector: 'Public', kind: 'Punjab Govt Chartered', fee: 110000, distance: 5.2, hostel: false,
    closing: { 2024: 79.2, 2023: 78.4, 2022: 77.0 },
    formula: { matric: 15, inter: 35, test: 50 }, testName: 'ITU Admissions Test', testDate: 'Jul 14',
    scholarship: { label: '50% merit waiver', minAgg: 80 },
  },
  {
    id: 'cui-cs', uni: 'COMSATS University', short: 'COMSATS', campus: 'Lahore Campus', program: 'BS Computer Science',
    sector: 'Public', kind: 'Federal Public', fee: 98000, distance: 14.1, hostel: true,
    closing: { 2024: 77.2, 2023: 76.85, 2022: 76.0 },
    formula: { matric: 0, inter: 50, test: 50 }, testName: 'NTS NAT-ICS', testDate: 'Jun – Jul',
    scholarship: { label: '100% fee waiver (top 3 rank)', minAgg: 88 },
  },
  {
    id: 'cui-se', uni: 'COMSATS University', short: 'COMSATS', campus: 'Lahore Campus', program: 'BS Software Engineering',
    sector: 'Public', kind: 'Federal Public', fee: 98000, distance: 14.1, hostel: true,
    closing: { 2024: 78.4, 2023: 77.6, 2022: 76.9 },
    formula: { matric: 0, inter: 50, test: 50 }, testName: 'NTS NAT-ICS', testDate: 'Jun – Jul',
    scholarship: { label: '100% fee waiver (top 3 rank)', minAgg: 88 },
  },
  {
    id: 'pu-cs', uni: 'Punjab University (PUCIT)', short: 'PU', campus: 'Allama Iqbal Campus', program: 'BS Computer Science (Morning)',
    sector: 'Public', kind: 'Public Provincial', fee: 42000, distance: 6.8, hostel: true,
    closing: { 2024: 87.4, 2023: 86.9, 2022: 86.2 },
    formula: { matric: 25, inter: 50, test: 25 }, testName: 'PU Entry Test', testDate: 'Jul 20',
    scholarship: null,
  },
  {
    id: 'uet-cs', uni: 'UET Lahore', short: 'UET', campus: 'Main Campus', program: 'BS Computer Science',
    sector: 'Public', kind: 'Public Provincial', fee: 28000, distance: 11.2, hostel: true,
    closing: { 2024: 82.1, 2023: 81.4, 2022: 80.9 },
    formula: { matric: 10, inter: 40, test: 50 }, testName: 'ECAT', testDate: 'Aug 3',
    scholarship: { label: 'Need-based support', minAgg: 0 },
  },
  {
    id: 'nust-se', uni: 'NUST', short: 'NUST', campus: 'SEECS, Islamabad', program: 'BS Software Engineering',
    sector: 'Public', kind: 'National Flagship', fee: 125000, distance: 285, hostel: true,
    closing: { 2024: 84.65, 2023: 84.1, 2022: 83.4 },
    formula: { matric: 10, inter: 15, test: 75 }, testName: 'NUST NET', testDate: 'Jun 22 – Jul 5',
    scholarship: { label: '50% merit scholarship', minAgg: 88 },
  },
  {
    id: 'giki-cs', uni: 'GIKI', short: 'GIKI', campus: 'Topi, Swabi', program: 'BS Computer Science',
    sector: 'Private', kind: 'Private Engineering', fee: 350000, distance: 330, hostel: true,
    closing: { 2024: 88.0, 2023: 87.2, 2022: 86.5 },
    formula: { matric: 10, inter: 20, test: 70 }, testName: 'GIKI Admission Test', testDate: 'Jul 12',
    scholarship: { label: 'Merit scholarship up to 100%', minAgg: 90 },
  },
];

export const TEST_OPTIONS = [
  'FAST NU Test',
  'NUST NET',
  'ECAT (UET Punjab)',
  'NTS NAT-ICS / IE',
  'GIKI Admission Test',
];

export const STAGES = [
  { value: 'part1', label: 'Inter Part 1' },
  { value: 'part2', label: 'Part 2 awaited' },
  { value: 'fsc', label: 'FSc completed' },
  { value: 'alevels', label: 'A-Levels / other' },
];

export const GROUPS = [
  { value: 'Pre-Engineering', label: 'Pre-Engineering' },
  { value: 'Pre-Medical', label: 'Pre-Medical' },
  { value: 'ICS', label: 'ICS (Computer Science)' },
  { value: 'General Science', label: 'General Science' },
  { value: 'I.Com', label: 'I.Com / Commerce' },
];
