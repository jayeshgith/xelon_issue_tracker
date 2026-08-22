export const dashboardPathForRole = (role) => {
  if (role === 'admin') {
    return '/admin/dashboard';
  }

  if (role === 'developer') {
    return '/developer/dashboard';
  }

  return '/user/dashboard';
};
