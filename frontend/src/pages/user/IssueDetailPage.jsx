import { CheckCircle2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Select from '../../components/common/Select.jsx';
import CommentThread from '../../components/comments/CommentThread.jsx';
import { priorityMeta, STATUS_OPTIONS, statusMeta } from '../../constants/options.js';
import { useAuth } from '../../context/AuthContext.jsx';
import * as issueService from '../../services/issueService.js';
import * as userService from '../../services/userService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';

const IssueDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadIssue = async () => {
    setLoading(true);
    setError('');

    try {
      const [issueData, developerItems] = await Promise.all([
        issueService.getIssue(id),
        user?.role === 'admin' ? userService.getDevelopers() : Promise.resolve([])
      ]);
      setIssue(issueData);
      setStatus(issueData.status);
      setAssignedTo(issueData.assignedTo?._id || '');
      setDevelopers(developerItems);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load issue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssue();
  }, [id, user?.role]);

  const handleWorkflowUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const payload = user?.role === 'admin' ? { status, assignedTo: assignedTo || null } : { status };
      const updated = await issueService.updateIssue(issue._id, payload);
      setIssue(updated);
      setSuccess('Issue updated successfully');
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to update issue'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading issue..." />;
  }

  if (error && !issue) {
    return <ErrorState message={error} onRetry={loadIssue} />;
  }

  const canManageWorkflow = user?.role === 'admin' || user?.role === 'developer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">{issue.issueId}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{issue.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={statusMeta[issue.status]?.className}>{statusMeta[issue.status]?.label}</Badge>
            <Badge className={priorityMeta[issue.priority]?.className}>{priorityMeta[issue.priority]?.label}</Badge>
          </div>
        </div>
        {(user?.role === 'admin' || (user?.role === 'user' && issue.status === 'OPEN' && !issue.assignedTo)) ? (
          <Link
            to={`/issues/${issue._id}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit Issue
          </Link>
        ) : null}
      </div>

      {success ? (
        <p className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          {success}
        </p>
      ) : null}
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel p-5">
          <h2 className="text-base font-semibold text-slate-950">Issue Details</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{issue.description}</p>
          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Category</dt>
              <dd className="mt-1 text-sm text-slate-700">{issue.category?.name || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Reporter</dt>
              <dd className="mt-1 text-sm text-slate-700">{fullName(issue.createdBy)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Assigned Developer</dt>
              <dd className="mt-1 text-sm text-slate-700">{fullName(issue.assignedTo)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Created</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDate(issue.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Updated</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDate(issue.updatedAt)}</dd>
            </div>
          </dl>
        </section>

        {canManageWorkflow ? (
          <form className="panel h-fit space-y-4 p-5" onSubmit={handleWorkflowUpdate}>
            <h2 className="text-base font-semibold text-slate-950">Workflow</h2>
            {user?.role === 'admin' ? (
              <Select
                id="assignedTo"
                label="Assigned Developer"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
              >
                <option value="">Unassigned</option>
                {developers.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.firstName} {developer.lastName}
                  </option>
                ))}
              </Select>
            ) : null}
            <Select id="status" label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUS_OPTIONS.filter((option) => user?.role === 'admin' || option.value !== 'OPEN').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button type="submit" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save workflow'}
            </Button>
          </form>
        ) : null}
      </div>

      <CommentThread issueId={issue._id} />
    </div>
  );
};

export default IssueDetailPage;
