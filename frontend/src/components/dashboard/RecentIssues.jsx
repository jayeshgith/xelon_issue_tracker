import { Link } from 'react-router-dom';
import { priorityMeta, statusMeta } from '../../constants/options.js';
import { formatDate, fullName } from '../../utils/formatters.js';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';

const RecentIssues = ({ issues = [] }) => {
  if (!issues.length) {
    return <EmptyState title="No recent issues" description="Issues will appear here when activity starts." />;
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Recent Issues</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {issues.map((issue) => (
          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
            className="block px-5 py-4 transition hover:bg-slate-50"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">
                  {issue.issueId} - {issue.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {issue.category?.name || 'Uncategorized'} | Reporter: {fullName(issue.createdBy)} | Updated{' '}
                  {formatDate(issue.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={statusMeta[issue.status]?.className}>{statusMeta[issue.status]?.label}</Badge>
                <Badge className={priorityMeta[issue.priority]?.className}>{priorityMeta[issue.priority]?.label}</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentIssues;
