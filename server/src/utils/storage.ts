export const storage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  getUserId: () => localStorage.getItem('user_id'),
  setUserId: (id: string) => localStorage.setItem('user_id', id),
  removeUserId: () => localStorage.removeItem('user_id'),
  clearAuth: () => {
    storage.removeToken();
    storage.removeUserId();
  }
}; 