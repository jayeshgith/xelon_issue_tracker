import { Eye, EyeOff, Pencil, Plus, Power, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import * as userService from '../../services/userService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';

const blankDeveloper = { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' };

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [form, setForm] = useState(blankDeveloper);
  const [editingId, setEditingId] = useState(null);
  const [credential, setCredential] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDevelopers = async () => {
    setLoading(true); setError('');
    try { setDevelopers(await userService.getDevelopers()); } catch (apiError) { setError(getApiError(apiError, 'Unable to load developers')); } finally { setLoading(false); }
  };

  useEffect(() => { loadDevelopers(); }, []);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const closeForm = () => { setEditingId(null); setForm(blankDeveloper); };
  const openCreate = () => { closeForm(); setEditingId('new'); setError(''); };

  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      if (editingId === 'new') await userService.createDeveloper(form);
      else await userService.updateDeveloper(editingId, form);
      setMessage(editingId === 'new' ? 'Developer created' : 'Developer updated'); closeForm(); await loadDevelopers();
    } catch (apiError) { setError(getApiError(apiError, 'Unable to save developer')); } finally { setSaving(false); }
  };

  const editDeveloper = (developer) => { setEditingId(developer._id); setForm({ firstName: developer.firstName, lastName: developer.lastName, email: developer.email, phone: developer.phone, password: '', confirmPassword: '' }); setCredential(null); };
  const toggleStatus = async (developer) => { setSaving(true); setError(''); try { await userService.updateDeveloperStatus(developer._id, !developer.isActive); setMessage(developer.isActive ? 'Developer deactivated' : 'Developer activated'); await loadDevelopers(); } catch (apiError) { setError(getApiError(apiError, 'Unable to update developer status')); } finally { setSaving(false); } };
  const viewCredential = async (developerId) => { setError(''); setShowPassword(false); try { setCredential(await userService.getDeveloperCredential(developerId)); } catch (apiError) { setError(getApiError(apiError, 'Unable to load credential')); } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-semibold text-slate-950">Developers</h1><p className="mt-1 text-sm text-slate-500">Create and manage company developer accounts.</p></div><Button onClick={openCreate}><Plus size={16} />Add Developer</Button></div>
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {editingId ? <form className="panel grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}><Input name="firstName" label="First Name" value={form.firstName} onChange={updateForm} required /><Input name="lastName" label="Last Name" value={form.lastName} onChange={updateForm} required /><Input name="email" type="email" label="Email" value={form.email} onChange={updateForm} required /><Input name="phone" label="Mobile Number" placeholder="+919876543210" value={form.phone} onChange={updateForm} required />{editingId === 'new' ? <><Input name="password" type="password" label="Password" value={form.password} onChange={updateForm} required /><Input name="confirmPassword" type="password" label="Confirm Password" value={form.confirmPassword} onChange={updateForm} required /></> : null}<div className="flex gap-2 sm:col-span-2"><Button type="submit" disabled={saving}><Save size={16} />{editingId === 'new' ? 'Create Developer' : 'Save Changes'}</Button><Button type="button" variant="secondary" onClick={closeForm}><X size={16} />Cancel</Button></div></form> : null}
      {loading ? <LoadingState label="Loading developers..." /> : null}
      {error && !loading && !developers.length ? <ErrorState message={error} onRetry={loadDevelopers} /> : null}
      {!loading && developers.length ? <div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{['Name', 'Email', 'Phone', 'Status', 'Assigned', 'In Progress', 'Closed', 'Created', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 bg-white">{developers.map((developer) => <tr key={developer._id}><td className="px-4 py-3 text-sm font-medium text-slate-950">{fullName(developer)}</td><td className="px-4 py-3 text-sm text-slate-600">{developer.email}</td><td className="px-4 py-3 text-sm text-slate-600">{developer.phone}</td><td className="px-4 py-3"><Badge className={developer.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}>{developer.isActive ? 'Active' : 'Inactive'}</Badge></td><td className="px-4 py-3 text-sm text-slate-600">{developer.assignedIssues || 0}</td><td className="px-4 py-3 text-sm text-slate-600">{developer.inProgress || 0}</td><td className="px-4 py-3 text-sm text-slate-600">{developer.closed || 0}</td><td className="px-4 py-3 text-sm text-slate-500">{formatDate(developer.createdAt)}</td><td className="px-4 py-3"><div className="flex gap-1"><Button variant="ghost" size="icon" title="Edit developer" onClick={() => editDeveloper(developer)}><Pencil size={16} /></Button><Button variant="ghost" size="icon" title="Show password" onClick={() => viewCredential(developer._id)}><Eye size={16} /></Button><Button variant="ghost" size="icon" title={developer.isActive ? 'Deactivate developer' : 'Activate developer'} onClick={() => toggleStatus(developer)} disabled={saving}><Power size={16} /></Button></div></td></tr>)}</tbody></table></div></div> : null}
      {!loading && !developers.length && !error ? <div className="panel p-8 text-center text-sm text-slate-500">No developers created yet.</div> : null}
      {credential ? <div className="panel p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-slate-950">Developer credential</h2><p className="mt-1 text-sm text-slate-500">{fullName(credential.developer)} · {credential.developer.email}</p></div><Button variant="ghost" size="icon" title="Close credential" onClick={() => setCredential(null)}><X size={16} /></Button></div><div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-sm text-slate-600">Password:</span><code className="rounded bg-slate-100 px-2 py-1 text-sm">{showPassword ? credential.password : '**********'}</code><Button variant="secondary" size="sm" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}{showPassword ? 'Hide' : 'Show'}</Button></div></div> : null}
    </div>
  );
};

export default DevelopersPage;
