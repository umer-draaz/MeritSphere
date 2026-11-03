import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, SlidersHorizontal, GitCompareArrows } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { fmt } from '../lib/merit.js';

const LINKS = [
  { to: '/', label: 'Navigator', end: true },
  { to: '/results', label: 'My Results' },
  { to: '/calculator', label: 'Marks Needed' },
  { to: '/explore', label: 'Explore & Compare' },
];

function Navbar() {
  const { profile, derived } = useProfile();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark"><GraduationCap size={20} /></span>
          MeritSphere
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-right">
          <span className="chip"><span className="dot" />{profile.group} • {fmt(derived.interPct, 1)}%</span>
          {pathname !== '/' && (
            <Link to="/" className="btn btn-primary btn-sm"><SlidersHorizontal size={15} /> Edit inputs</Link>
          )}
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function CompareBar() {
  const { compare, clearCompare } = useProfile();
  const { pathname } = useLocation();
  if (compare.length === 0 || pathname === '/explore') return null;
  return (
    <div className="cbar">
      <GitCompareArrows size={18} />
      <span>{compare.length} selected to compare</span>
      <button className="x-btn" style={{ color: '#fff', opacity: 0.7 }} onClick={clearCompare} aria-label="Clear"><X size={16} /></button>
      <Link to="/explore" className="btn btn-sm">Open comparison</Link>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
      <CompareBar />
      <footer className="footer">
        <div className="container">
          Estimates are advisory only and not an admission guarantee. Based on demo closing-merit data (2022–2024).
        </div>
      </footer>
    </>
  );
}
