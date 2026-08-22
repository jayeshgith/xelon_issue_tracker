import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children, footer, showBackLink = true }) => (
  <main className="grid min-h-screen place-items-center px-4 py-8">
    <section className="w-full max-w-md">
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold text-slate-950">Xelon Issue Tracker</p>
        <p className="text-sm text-brand-700">Internal issue management</p>
      </div>
      <div className="panel p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
      {footer ? <div className="mt-5 text-center text-sm text-slate-600">{footer}</div> : null}
      {showBackLink ? (
        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-900">
            Back to sign in
          </Link>
        </div>
      ) : null}
    </section>
  </main>
);

export default AuthLayout;
