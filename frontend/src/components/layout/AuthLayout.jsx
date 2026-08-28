import { CheckCircle2, Clock3, Inbox, UserCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../common/BrandMark.jsx';

const steps = [
  { icon: Inbox, text: 'Users report the problem in seconds.' },
  { icon: UserCheck, text: 'Admins review and assign a developer.' },
  { icon: Wrench, text: 'Developers update status and comments.' },
  { icon: CheckCircle2, text: 'Issues close and stay visible to everyone.' }
];

const AuthLayout = ({ title, subtitle, children, footer, showBackLink = true }) => (
  <div className="app-bg flex min-h-screen lg:grid lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <Link to="/" aria-label="Xelon Issue Tracker home">
          <BrandMark subtitle="Issue Tracker" markClassName="from-brand-400 to-brand-600" />
        </Link>
      </div>

      <div className="relative max-w-md">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
          Track. Assign.
          <br />
          <span className="text-gradient">Resolve.</span>
        </h1>
        <p className="mt-4 text-lg text-brand-100/80">
          A centralized issue management platform for the whole team.
        </p>
        <ul className="mt-8 space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.text} className="flex items-center gap-3 text-sm text-brand-100/90">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
                  <Icon size={17} aria-hidden="true" />
                </span>
                {step.text}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative text-xs text-brand-200/60">© 2026 Xelon Issue Tracker</p>
    </div>

    <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <Link to="/" aria-label="Xelon Issue Tracker home">
            <BrandMark />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Welcome to Xelon</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>

        {footer ? <div className="mt-5 text-center text-sm text-slate-600">{footer}</div> : null}

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          {showBackLink ? (
            <Link to="/login" className="font-medium text-brand-700 transition hover:text-brand-900">
              Back to sign in
            </Link>
          ) : null}
          <span aria-hidden="true" className={showBackLink ? 'inline-block h-3 w-px bg-slate-300' : 'hidden'} />
          <Link to="/" className="font-medium text-slate-500 transition hover:text-slate-800">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;