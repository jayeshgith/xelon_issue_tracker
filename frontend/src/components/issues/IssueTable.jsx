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
          <thead className="bg-slate-50">
            <tr>
              {['Issue', 'Category', 'Priority', 'Status', 'Created By', 'Assigned', 'Updated', 'Actions'].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {issues.map((issue) => (
              <tr key={issue._id} className="hover:bg-slate-50">
                <td className="max-w-xs px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">{issue.issueId}</p>
                  <p className="mt-1 truncate text-sm text-slate-600">{issue.title}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{issue.category?.name || '-'}</td>
                <td className="px-4 py-3">
                  <Badge className={priorityMeta[issue.priority]?.className}>{priorityMeta[issue.priority]?.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusMeta[issue.status]?.className}>{statusMeta[issue.status]?.label}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{fullName(issue.createdBy)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{fullName(issue.assignedTo)}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatDate(issue.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="grid h-9 w-9 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      title="View issue"
                    >
                      <Eye size={16} />
                    </Link>
                    {canEdit(issue) ? (
                      <Link
                        to={`/issues/${issue._id}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                        title="Edit issue"
                      >
                        <Edit size={16} />
                      </Link>
                    ) : null}
                    {canDelete(issue) ? (
                      <Button variant="ghost" size="icon" title="Delete issue" onClick={() => onDelete(issue)}>
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
