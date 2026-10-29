import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandMark from '../common/BrandMark.jsx';

const exploreLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Roles', href: '#roles' }
];

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Track. Assign. Resolve. A centralized platform trusted by teams to move issues from
              report to resolution.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-500 transition hover:text-brand-700">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-slate-500 transition hover:text-brand-700"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Resources</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/jayeshgith/xelon_issue_tracker.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-700"
                >
                  <Github size={15} aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">© 2026 Xelon Issue Tracker. All rights reserved. | Annu@gmail.com</p>
          <p className="text-xs font-medium text-slate-400">
            Track. Assign. <span className="text-brand-600">Resolve.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;