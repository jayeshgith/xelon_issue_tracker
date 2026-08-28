import { Check, PencilRuler, Radar, Rocket } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const roles = [
  {
    icon: Radar,
    title: 'Report & Track',
    role: 'User',
    accent: 'from-brand-500 to-brand-700',
    ring: 'group-hover:ring-brand-200',
    features: ['Create issues', 'Select categories', 'Set priority', 'Add comments', 'Track progress']
  },
  {
    icon: PencilRuler,
    title: 'Manage & Assign',
    role: 'Admin',
    accent: 'from-indigo-500 to-violet-700',
    ring: 'group-hover:ring-indigo-200',
    features: [
      'Review issues',
      'Assign developers',
      'Manage users',
      'Manage developers',
      'Manage categories',
      'Monitor progress'
    ]
  },
  {
    icon: Rocket,
    title: 'Resolve & Deliver',
    role: 'Developer',
    accent: 'from-sky-500 to-cyan-600',
    ring: 'group-hover:ring-sky-200',
    features: ['View assigned issues', 'Work on issues', 'Add comments', 'Update status', 'Resolve issues']
  }
];

const RolesSection = () => (
  <section id="roles" className="scroll-mt-20 bg-slate-50/70 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Role-based experience</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          One platform. Three roles.
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Everyone gets a dashboard built around their job — report, assign, or resolve. No clutter, no noise.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {roles.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.role} delay={index * 120}>
              <article
                className={`group relative h-full rounded-2xl border border-slate-200/80 bg-white p-7 shadow-card ring-1 ring-transparent transition duration-300 hover:-translate-y-1.5 hover:shadow-lift ${item.ring}`}
              >
                <span
                  className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg ${item.accent}`}
                >
                  <Icon size={24} aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">{item.role}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{item.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default RolesSection;