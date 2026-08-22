import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApiError } from '../../utils/formatters.js';
import { dashboardPathForRole } from '../../utils/navigation.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(form);
      const fallback = dashboardPathForRole(user.role);
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to login'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your dashboard using your Xelon account."
      showBackLink={false}
      footer={
        <>
          New user?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:text-brand-900">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
        <div>
          <Input
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-900">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          <LogIn size={16} />
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
