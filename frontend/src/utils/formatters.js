export const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

export const fullName = (user) => {
  if (!user) {
    return 'Unassigned';
  }

  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
};

export const getApiError = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback;

export const isValidIndianPhone = (phone) => /^\+91\d{10}$/.test(String(phone || '').trim());

export const isStrongPassword = (password) => {
  const value = String(password || '');
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
};
