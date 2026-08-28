import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Folder,
  Inbox,
  Save,
  UserRound,
  UserRoundCog,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../../components/common/Alert.jsx';
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

const workflowStages = [
  { key: 'OPEN', label: 'Open', icon: Inbox },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Clock3 },
  { key: 'CLOSED', label: 'Closed', icon: CheckCircle2 }
];

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
      setStatus(updated.status);
      setAssignedTo(updated.assignedTo?._id || '');
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
  const canEdit =
    user?.role === 'admin' || (user?.role === 'user' && issue.status === 'OPEN' && !issue.assignedTo);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {issue.issueId}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{issue.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={statusMeta[issue.status]?.className} dot dotClassName={statusMeta[issue.status]?.dot}>
              {statusMeta[issue.status]?.label}
            </Badge>
            <Badge className={priorityMeta[issue.priority]?.className} dot dotClassName={priorityMeta[issue.priority]?.dot}>
              {priorityMeta[issue.priority]?.label}
            </Badge>
            <Badge className="bg-slate-100 text-slate-600 ring-slate-200">{issue.category?.name || 'Uncategorized'}</Badge>
          </div>
        </div>
        {canEdit ? (
          <Link
            to={`/issues/${issue._id}/edit`}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <Edit3 size={16} />
            Edit Issue
          </Link>
        ) : null}
      </div>

      {success ? <Alert variant="success">{success}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel min-w-0 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <Folder size={17} className="text-brand-600" aria-hidden="true" />
            Issue Details
          </h2>
          <div className="mt-4 rounded-xl bg-slate-50/70 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{issue.description}</p>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 px-4 py-3">
              <UserRound size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Reporter</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{fullName(issue.createdBy)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 px-4 py-3">
              <UserRoundCog size={18} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden="true" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Assigned Developer</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{fullName(issue.assignedTo)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 px-4 py-3">
              <Folder size={18} className="mt-0.5 shrink-0 text-sky-600" aria-hidden="true" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Category</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{issue.category?.name || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 px-4 py-3">
              <CalendarDays size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Created</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{formatDate(issue.createdAt)}</dd>
              </div>
            </div>
          </dl>
        </section>

        {canManageWorkflow ? (
          <form className="panel h-fit space-y-5 p-5 sm:p-6" onSubmit={handleWorkflowUpdate}>
            <h2 className="text-base font-semibold text-slate-950">Workflow</h2>

            <div className="flex items-center justify-between">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                const reached = STATUS_OPTIONS.findIndex((option) => option.value === status) >= index;

                return (
                  <div key={stage.key} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full ring-1 ring-inset transition ${
                          reached ? 'bg-brand-600 text-white ring-brand-600' : 'bg-slate-100 text-slate-400 ring-slate-200'
                        }`}
                      >
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${reached ? 'text-brand-700' : 'text-slate-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                    {index < workflowStages.length - 1 ? (
                      <span className="mx-1.5 mb-5 h-0.5 flex-1 rounded bg-slate-200" aria-hidden="true" />
                    ) : null}
                  </div>
                );
              })}
            </div>

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
            <Button type="submit" className="w-full" disabled={saving}>
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