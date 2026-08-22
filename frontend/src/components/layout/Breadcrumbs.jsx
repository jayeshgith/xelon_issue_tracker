import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const roleDashboard = {
  admin: { label: 'Admin Dashboard', path: '/admin/dashboard' },
  developer: { label: 'Developer Dashboard', path: '/developer/dashboard' },
  user: { label: 'Dashboard', path: '/user/dashboard' }
};

const getBreadcrumbs = (pathname, role) => {
  const dashboard = roleDashboard[role] || roleDashboard.user;
  const items = [{ label: dashboard.label, path: dashboard.path }];

  if (pathname === dashboard.path || pathname === '/dashboard') {
    return items;
  }

  if (pathname === '/issues' || pathname === '/admin/issues' || pathname === '/developer/issues') {
    items.push({ label: role === 'user' ? 'My Issues' : 'Issues' });
    return items;
  }

  if (pathname === '/issues/create') {
    items.push({ label: 'My Issues', path: '/issues' }, { label: 'Create Issue' });
    return items;
  }

  if (pathname === '/admin/users') {
    items.push({ label: 'Users' });
    return items;
  }

  if (pathname === '/admin/developers') {
    items.push({ label: 'Developers' });
    return items;
  }

  if (pathname === '/admin/categories') {
    items.push({ label: 'Categories' });
    return items;
  }

  if (pathname.match(/^\/issues\/[^/]+\/edit$/)) {
    items.push({ label: 'My Issues', path: '/issues' }, { label: 'Issue Details', path: pathname.replace('/edit', '') }, { label: 'Edit Issue' });
    return items;
  }

  if (pathname.match(/^\/issues\/[^/]+$/)) {
    items.push({ label: role === 'user' ? 'My Issues' : 'Issues', path: role === 'user' ? '/issues' : `/${role}/issues` }, { label: 'Issue Details' });
  }

  return items;
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const items = getBreadcrumbs(pathname, user?.role);

  return (
    <nav aria-label="Breadcrumb" className="mb-5 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1 text-sm text-slate-500">
        <li className="flex items-center">
          <Link
            to={items[0].path}
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label={items[0].label}
          >
            <Home size={15} />
            <span>{items[0].label}</span>
          </Link>
        </li>
        {items.slice(1).map((item) => (
          <li key={`${item.label}-${item.path || 'current'}`} className="flex items-center">
            <ChevronRight size={15} className="mx-1 shrink-0 text-slate-400" aria-hidden="true" />
            {item.path ? (
              <Link
                to={item.path}
                className="rounded-md px-1.5 py-1 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-1.5 py-1 font-medium text-slate-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
