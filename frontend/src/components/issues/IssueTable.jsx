import { Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { priorityMeta, statusMeta } from '../../constants/options.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate, fullName } from '../../utils/formatters.js';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';

const IssueTable = ({ issues = [], onDelete }) => {
  const { user } = useAuth();

  if (!issues.length) {
    return <EmptyState title="No issues found" description="Try adjusting filters or create a new issue." />;
  }

  const canEdit = (issue) =>
    user?.role === 'admin' || (user?.role === 'user' && issue.status === 'OPEN' && !issue.assignedTo);

  const canDelete = (issue) =>
    user?.role === 'admin' || (user?.role === 'user' && issue.status === 'OPEN' && !issue.assignedTo);

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100/70">
            <tr>
              {['Issue', 'Category', 'Priority', 'Status', 'Created By', 'Assigned', 'Updated', 'Actions'].map((heading) => (
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
            {issues.map((issue) => (
              <tr key={issue._id} className="transition hover:bg-brand-50/40">
                <td className="max-w-xs px-4 py-3.5">
                  <p>
                    <Link to={`/issues/${issue._id}`} className="text-sm font-bold text-slate-900 hover:text-brand-700">
                      {issue.issueId}
                    </Link>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-slate-600">{issue.title}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                    {issue.category?.name || '-'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge className={priorityMeta[issue.priority]?.className} dot dotClassName={priorityMeta[issue.priority]?.dot}>
                    {priorityMeta[issue.priority]?.label}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <Badge className={statusMeta[issue.status]?.className} dot dotClassName={statusMeta[issue.status]?.dot}>
                    {statusMeta[issue.status]?.label}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{fullName(issue.createdBy)}</td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{fullName(issue.assignedTo)}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(issue.updatedAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                      title="View issue"
                      aria-label={`View issue ${issue.issueId}`}
                    >
                      <Eye size={16} />
                    </Link>
                    {canEdit(issue) ? (
                      <Link
                        to={`/issues/${issue._id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
                        title="Edit issue"
                        aria-label={`Edit issue ${issue.issueId}`}
                      >
                        <Edit size={16} />
                      </Link>
                    ) : null}
                    {canDelete(issue) ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete issue"
                        aria-label={`Delete issue ${issue.issueId}`}
                        className="hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => onDelete(issue)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;