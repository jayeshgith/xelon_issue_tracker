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
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

const baseLink =
  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-950';
const activeLink = 'bg-brand-50 text-brand-900 ring-1 ring-brand-100';
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
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <p className="text-base font-semibold text-slate-950">Xelon</p>
          <p className="text-xs font-medium text-brand-700">Issue Tracker</p>
        </div>
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
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => (
  <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
      <SidebarContent />
    </aside>
    {open ? (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button className="absolute inset-0 bg-slate-950/40" aria-label="Close navigation overlay" onClick={onClose} />
        <aside className="relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
          <SidebarContent onClose={onClose} />
        </aside>
      </div>
    ) : null}
  </>
);

export default Sidebar;
