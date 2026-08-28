import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import IssueFilters from '../../components/issues/IssueFilters.jsx';
import IssueTable from '../../components/issues/IssueTable.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as categoryService from '../../services/categoryService.js';
import * as issueService from '../../services/issueService.js';
import * as userService from '../../services/userService.js';
import { getApiError } from '../../utils/formatters.js';

const defaultFilters = {
  search: '',
  status: '',
  category: '',
  priority: '',
  developer: '',
  page: 1,
  limit: 10
};

const IssuesPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [issues, setIssues] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const title = isAdmin ? 'All Issues' : user?.role === 'developer' ? 'Assigned Issues' : 'My Issues';
  const subtitle = isAdmin
    ? 'Review, filter, assign, and manage every issue.'
    : user?.role === 'developer'
      ? 'Issues assigned to you by an admin.'
      : 'Issues created from your user account.';

  const loadReferenceData = async () => {
    const [categoryItems, developerItems] = await Promise.all([
      categoryService.getCategories(),
      isAdmin ? userService.getDevelopers() : Promise.resolve([])
    ]);
    setCategories(categoryItems);
    setDevelopers(developerItems);
  };

  const loadIssues = async () => {
    setLoading(true);
    setError('');

    try {
      await loadReferenceData();
      const result = await issueService.getIssues(appliedFilters);
      setIssues(result.issues);
      setPagination(result.pagination);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load issues'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [appliedFilters, user?.role]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleApply = (event) => {
    event.preventDefault();
    setAppliedFilters({ ...filters, page: 1 });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleDelete = async (issue) => {
    if (!window.confirm(`Delete ${issue.issueId}?`)) {
      return;
    }

    await issueService.deleteIssue(issue._id);
    await loadIssues();
  };

  const goToPage = (page) => {
    setAppliedFilters((current) => ({ ...current, page }));
    setFilters((current) => ({ ...current, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {user?.role === 'user' ? (
          <Link
            to="/issues/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <PlusCircle size={16} />
            Create Issue
          </Link>
        ) : null}
      </div>
      <IssueFilters
        filters={filters}
        categories={categories}
        developers={developers}
        isAdmin={isAdmin}
        onChange={handleFilterChange}
        onApply={handleApply}
        onReset={handleReset}
      />
      {loading ? <LoadingState label="Loading issues..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadIssues} /> : null}
      {!loading && !error ? <IssueTable issues={issues} onDelete={handleDelete} /> : null}
      {!loading && !error && pagination && pagination.pages > 1 ? (
        <div className="panel flex flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row">
          <span className="text-sm text-slate-600">
            Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-900">{pagination.pages}</span> — {pagination.total} issues
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IssuesPage;