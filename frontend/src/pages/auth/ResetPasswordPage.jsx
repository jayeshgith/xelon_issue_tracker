import { KeyRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { resetPassword } from '../../services/authService.js';
import { getApiError, isStrongPassword } from '../../utils/formatters.js';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError('Reset token is missing');
      return;
    }

    if (!isStrongPassword(form.password)) {
      setError('Password must be at least 8 characters and include letters and numbers');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Confirm password must match password');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await resetPassword({ token, ...form });
      setMessage('Password reset successful. Redirecting to sign in...');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to reset password'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create new password" subtitle="Use the reset link from your email.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <Input
          id="password"
          name="password"
          label="New Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          <KeyRound size={16} />
          {submitting ? 'Updating password...' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
