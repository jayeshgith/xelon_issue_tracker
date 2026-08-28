import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import BrandMark from '../common/BrandMark.jsx';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Roles', href: '#roles' }
];

const LandingNavbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" aria-label="Xelon Issue Tracker home" className="shrink-0">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => goTo('/dashboard')}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
            >
              Open Dashboard
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goTo('/login')}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => goTo('/register')}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Get Started
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="landing-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {menuOpen ? (
        <div id="landing-menu" className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => goTo('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Open Dashboard
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => goTo('/login')}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo('/register')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
                  >
                    Get Started
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default LandingNavbar;