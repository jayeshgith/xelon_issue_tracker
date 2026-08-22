import { Mail } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { forgotPassword } from '../../services/authService.js';
import { getApiError } from '../../utils/formatters.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to request reset link'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter your account email to receive a reset link.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <Input id="email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Button type="submit" className="w-full" disabled={submitting}>
          <Mail size={16} />
          {submitting ? 'Sending link...' : 'Send reset link'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
