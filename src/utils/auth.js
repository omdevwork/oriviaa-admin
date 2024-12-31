export const isAuthenticated = () => {
  const token = localStorage.getItem('oriviaa_auth');
  return !!token;
};
