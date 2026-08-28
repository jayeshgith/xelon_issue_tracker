import { ArrowRight, ChevronRight } from 'lucide-react';
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
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Recent Issues</h2>
          <p className="mt-0.5 text-sm text-slate-500">Latest activity across the workspace.</p>
        </div>
        <Link
          to="/issues"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
        >
          View all
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {issues.map((issue) => (
          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
            className="group flex items-center gap-3 px-5 py-4 transition hover:bg-brand-50/40"
          >
            <span
              className={`hidden h-2 w-2 shrink-0 rounded-full sm:block ${statusMeta[issue.status]?.dot || statusMeta.OPEN.dot}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                <span className="font-mono text-xs font-medium text-slate-400">{issue.issueId}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">/</span>
                {issue.title}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {issue.category?.name || 'Uncategorized'} · Reporter: {fullName(issue.createdBy)} · Updated {formatDate(issue.updatedAt)}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Badge className={statusMeta[issue.status]?.className}>{statusMeta[issue.status]?.label}</Badge>
              <Badge className={`hidden sm:inline-flex ${priorityMeta[issue.priority]?.className}`}>{priorityMeta[issue.priority]?.label}</Badge>
              <ChevronRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentIssues;