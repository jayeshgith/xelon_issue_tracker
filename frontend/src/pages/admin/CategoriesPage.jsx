import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Select from '../../components/common/Select.jsx';
import * as categoryService from '../../services/categoryService.js';
import { getApiError } from '../../utils/formatters.js';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const syncDrafts = (items) => {
    const nextDrafts = {};
    items.forEach((category) => {
      nextDrafts[category._id] = {
        name: category.name,
        isActive: category.isActive
      };
    });
    setDrafts(nextDrafts);
  };

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const items = await categoryService.getCategories({ includeInactive: true });
      setCategories(items);
      syncDrafts(items);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDraftChange = (categoryId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [categoryId]: {
        ...current[categoryId],
        [field]: value
      }
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!newName.trim()) {
      setError('Category name is required');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await categoryService.createCategory({ name: newName });
      setNewName('');
      setMessage('Category created');
      await loadCategories();
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to create category'));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (categoryId) => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await categoryService.updateCategory(categoryId, drafts[categoryId]);
      setMessage('Category updated');
      await loadCategories();
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to update category'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Deactivate this category?')) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await categoryService.deleteCategory(categoryId);
      setMessage('Category deactivated');
      await loadCategories();
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to deactivate category'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Manage global issue categories used by users during reporting.</p>
      </div>
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <form className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-end" onSubmit={handleCreate}>
        <div className="flex-1">
          <Input id="newCategory" label="New Category" value={newName} onChange={(event) => setNewName(event.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>
          <Plus size={16} />
          Add Category
        </Button>
      </form>
      {loading ? <LoadingState label="Loading categories..." /> : null}
      {error && !loading && !categories.length ? <ErrorState message={error} onRetry={loadCategories} /> : null}
      {!loading && categories.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Name', 'Status', 'Actions'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-4 py-3">
                      <Input
                        id={`category-${category._id}`}
                        value={drafts[category._id]?.name || ''}
                        onChange={(event) => handleDraftChange(category._id, 'name', event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        id={`category-status-${category._id}`}
                        value={String(drafts[category._id]?.isActive)}
                        onChange={(event) => handleDraftChange(category._id, 'isActive', event.target.value === 'true')}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled={saving} onClick={() => handleSave(category._id)}>
                          <Save size={15} />
                          Save
                        </Button>
                        <Button variant="ghost" size="icon" disabled={saving} title="Deactivate category" onClick={() => handleDelete(category._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
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

export default CategoriesPage;
