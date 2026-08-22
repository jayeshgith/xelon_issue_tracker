import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApiError, isStrongPassword, isValidIndianPhone } from '../../utils/formatters.js';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '+91',
  password: '',
  confirmPassword: ''
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return 'First name and last name are required';
    }

    if (!isValidIndianPhone(form.phone)) {
      return 'Phone number must use +91XXXXXXXXXX format';
    }

    if (!isStrongPassword(form.password)) {
      return 'Password must be at least 8 characters and include letters and numbers';
    }

    if (form.password !== form.confirmPassword) {
      return 'Confirm password must match password';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/user/dashboard', { replace: true });
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to register'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create user account"
      subtitle="Public registration creates a regular user account only."
      showBackLink={false}
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-900">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="firstName" name="firstName" label="First Name" value={form.firstName} onChange={handleChange} required />
          <Input id="lastName" name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} required />
        </div>
        <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
        <Input id="phone" name="phone" label="Phone Number" value={form.phone} onChange={handleChange} required />
        <Input
          id="password"
          name="password"
          label="Password"
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
          <UserPlus size={16} />
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
