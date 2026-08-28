import { UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import Badge from '../../components/common/Badge.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import * as userService from '../../services/userService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      setUsers(await userService.getUsers());
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <UsersRound size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Users</h1>
          <p className="mt-0.5 text-sm text-slate-500">Registered public users. Passwords are never exposed.</p>
        </div>
      </div>
      {loading ? <LoadingState label="Loading users..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadUsers} /> : null}
      {!loading && !error ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/70">
                <tr>
                  {['Name', 'Email', 'Phone', 'Status', 'Created'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((item) => (
                  <tr key={item._id} className="transition hover:bg-brand-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white"
                          aria-hidden="true"
                        >
                          {`${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{fullName(item)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{item.email}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{item.phone}</td>
                    <td className="px-4 py-3.5">
                      <Badge
                        dot
                        dotClassName={item.isActive ? 'bg-emerald-500' : 'bg-slate-400'}
                        className={item.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-600 ring-slate-200'}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UsersPage;