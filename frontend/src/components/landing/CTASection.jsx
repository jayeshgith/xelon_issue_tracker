import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../common/Reveal.jsx';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-6 py-16 text-center shadow-lift sm:px-12">
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to manage your issues better?
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                Track problems. Assign work. Resolve faster.
              </p>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-brand-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Get Started
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;