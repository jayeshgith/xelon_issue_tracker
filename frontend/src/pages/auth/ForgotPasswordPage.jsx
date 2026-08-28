import { Mail } from 'lucide-react';
import { useState } from 'react';
import Alert from '../../components/common/Alert.jsx';
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
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          <Mail size={16} />
          {submitting ? 'Sending link...' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;