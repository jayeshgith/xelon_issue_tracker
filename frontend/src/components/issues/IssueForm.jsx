import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PRIORITY_OPTIONS } from '../../constants/options.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';

const emptyForm = {
  title: '',
  category: '',
  priority: 'MEDIUM',
  description: ''
};

const IssueForm = ({ categories, initialValues, submitting, submitLabel = 'Save issue', onSubmit }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        category: initialValues.category?._id || initialValues.category || '',
        priority: initialValues.priority || 'MEDIUM',
        description: initialValues.description || ''
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.category) {
      setError('Title, category, and description are required');
      return;
    }

    setError('');
    onSubmit(form);
  };

  return (
    <form className="panel space-y-5 p-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-base font-semibold text-slate-950">Issue details</h2>
        <p className="mt-1 text-sm text-slate-500">Provide the information needed to start working on this issue.</p>
      </div>
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800">{error}</p>
      ) : null}
      <Input id="title" name="title" label="Issue Title" placeholder="Short, clear summary of the problem" value={form.title} onChange={handleChange} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="category" name="category" label="Category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select id="priority" name="priority" label="Priority" value={form.priority} onChange={handleChange}>
          {PRIORITY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Describe the problem in as much detail as possible"
        value={form.description}
        onChange={handleChange}
        required
      />
      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-5">
        <Button type="submit" disabled={submitting}>
          <Save size={16} />
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;