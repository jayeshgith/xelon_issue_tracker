import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../../components/common/Alert.jsx';
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
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      showBackLink={false}
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-900">
            Register
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
        <div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-[42px] grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-brand-700 hover:text-brand-900">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          <LogIn size={16} />
          {submitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;