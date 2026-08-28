import {
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  UserCog,
  Users,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandMark from '../common/BrandMark.jsx';
import Button from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { fullName } from '../../utils/formatters.js';

const baseLink =
  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-950';
const activeLink = 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100';
const inactiveLink = 'text-slate-600';

const getLinks = (role) => {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Issues', to: '/admin/issues', icon: ListChecks },
      { label: 'Users', to: '/admin/users', icon: Users },
      { label: 'Developers', to: '/admin/developers', icon: UserCog },
      { label: 'Categories', to: '/admin/categories', icon: FolderKanban }
    ];
  }

  if (role === 'developer') {
    return [
      { label: 'Dashboard', to: '/developer/dashboard', icon: LayoutDashboard },
      { label: 'Assigned Issues', to: '/developer/issues', icon: ListChecks }
    ];
  }

  return [
    { label: 'Dashboard', to: '/user/dashboard', icon: LayoutDashboard },
    { label: 'My Issues', to: '/issues', icon: ListChecks },
    { label: 'Create Issue', to: '/issues/create', icon: PlusCircle }
  ];
};

const SidebarContent = ({ onClose }) => {
  const { user } = useAuth();
  const links = getLinks(user?.role);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
        <NavLink to="/dashboard" onClick={onClose} aria-label="Go to dashboard" className="shrink-0">
          <BrandMark subtitle="Issue Tracker" />
        </NavLink>
        <Button
          aria-label="Close navigation"
          title="Close navigation"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Sidebar">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`shrink-0 transition ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold uppercase text-white" aria-hidden="true">
            {(user?.firstName || '?')[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{fullName(user)}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => (
  <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white lg:block">
      <SidebarContent />
    </aside>
    {open ? (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close navigation overlay" onClick={onClose} />
        <aside className="relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl">
          <SidebarContent onClose={onClose} />
        </aside>
      </div>
    ) : null}
  </>
);

export default Sidebar;