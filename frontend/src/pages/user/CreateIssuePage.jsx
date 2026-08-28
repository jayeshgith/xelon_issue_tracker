import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import IssueForm from '../../components/issues/IssueForm.jsx';
import * as categoryService from '../../services/categoryService.js';
import * as issueService from '../../services/issueService.js';
import { getApiError } from '../../utils/formatters.js';

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      setCategories(await categoryService.getCategories());
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');

    try {
      const issue = await issueService.createIssue(payload);
      navigate(`/issues/${issue._id}`);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to create issue'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <PlusCircle size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create Issue</h1>
          <p className="mt-0.5 text-sm text-slate-500">Report a technical problem for admin review.</p>
        </div>
      </div>
      {loading ? <LoadingState label="Loading form..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadCategories} /> : null}
      {!loading && !error ? (
        <IssueForm categories={categories} submitting={submitting} submitLabel="Create issue" onSubmit={handleSubmit} />
      ) : null}
    </div>
  );
};

export default CreateIssuePage;