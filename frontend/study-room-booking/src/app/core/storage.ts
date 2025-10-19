export const safeStorage = {
  get(key: string): string | null {
    try {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (e) { return null; }
  },
  set(key: string, value: string) {
    try {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (e) { /* ignore */ }
  },
  remove(key: string) {
    try {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch (e) { /* ignore */ }
  },
  // session storage helpers
  getSession(key: string): string | null {
    try {
      if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return null;
      return sessionStorage.getItem(key);
    } catch (e) { return null; }
  },
  setSession(key: string, value: string) {
    try {
      if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return;
      sessionStorage.setItem(key, value);
    } catch (e) { /* ignore */ }
  },
  removeSession(key: string) {
    try {
      if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return;
      sessionStorage.removeItem(key);
    } catch (e) { /* ignore */ }
  }
};
