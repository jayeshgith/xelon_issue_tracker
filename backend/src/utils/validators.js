export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

export const isValidIndianPhone = (phone) => /^\+91\d{10}$/.test(String(phone || '').trim());

export const isStrongPassword = (password) => {
  const value = String(password || '');
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
};

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
