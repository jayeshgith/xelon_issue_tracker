import {
  BarChart3,
  CircleUserRound,
  FolderKanban,
  ListTodo,
  MessageSquareText,
  UserCog,
} from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const features = [
  {
    icon: ListTodo,
    title: 'Issue Management',
    description: 'Create, edit and track issues with a clear status at every stage.'
  },
  {
    icon: UserCog,
    title: 'Developer Assignment',
    description: 'Admins can assign issues to developers for focused resolution.'
  },
  {
    icon: CircleUserRound,
    title: 'Role-Based Experience',
    description: 'Separate interfaces for Users, Admins and Developers.'
  },
  {
    icon: MessageSquareText,
    title: 'Comments',
    description: 'Communicate directly around an issue, right where the context lives.'
  },
  {
    icon: FolderKanban,
    title: 'Categories & Priority',
    description: 'Organize issues effectively and surface what matters most.'
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Monitor issue progress and workload with live statistics and charts.'
  }
];

const FeaturesSection = () => (
  <section id="features" className="scroll-mt-20 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Everything included</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Built for the whole team
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          The tools your team needs to keep every issue moving toward closure.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Reveal key={feature.title} delay={index * 90}>
              <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;