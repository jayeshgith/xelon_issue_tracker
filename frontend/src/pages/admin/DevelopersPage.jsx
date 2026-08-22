import { useEffect, useState } from 'react';
import Badge from '../../components/common/Badge.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import * as userService from '../../services/userService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDevelopers = async () => {
    setLoading(true);
    setError('');

    try {
      setDevelopers(await userService.getDevelopers());
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load developers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevelopers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Developers</h1>
        <p className="mt-1 text-sm text-slate-500">Seeded developer accounts available for issue assignment.</p>
      </div>
      {loading ? <LoadingState label="Loading developers..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadDevelopers} /> : null}
      {!loading && !error ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Name', 'Email', 'Phone', 'Status', 'Created'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {developers.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-950">{fullName(item)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.phone}</td>
                    <td className="px-4 py-3">
                      <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">Active</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(item.createdAt)}</td>
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

export default DevelopersPage;
