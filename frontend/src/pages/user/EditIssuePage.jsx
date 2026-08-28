import { PencilLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import IssueForm from '../../components/issues/IssueForm.jsx';
import * as categoryService from '../../services/categoryService.js';
import * as issueService from '../../services/issueService.js';
import { getApiError } from '../../utils/formatters.js';

const EditIssuePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [issueData, categoryItems] = await Promise.all([issueService.getIssue(id), categoryService.getCategories()]);
      setIssue(issueData);
      setCategories(categoryItems);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load issue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');

    try {
      const updated = await issueService.updateIssue(id, payload);
      navigate(`/issues/${updated._id}`);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to update issue'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <PencilLine size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Issue</h1>
          <p className="mt-0.5 text-sm text-slate-500">Update issue details while permissions allow it.</p>
        </div>
      </div>
      {loading ? <LoadingState label="Loading issue..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadData} /> : null}
      {!loading && !error && issue ? (
        <IssueForm
          categories={categories}
          initialValues={issue}
          submitting={submitting}
          submitLabel="Update issue"
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
};

export default EditIssuePage;