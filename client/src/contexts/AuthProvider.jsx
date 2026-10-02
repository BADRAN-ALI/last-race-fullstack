

import { useEffect, useState } from 'react';
import * as API from '../API.js';
import { AuthContext } from './AuthContext.js';



export function AuthProvider({ children }) {
  const [user, setUser] = useState( (null));
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    let active = true;
    API.getCurrentSession()
      .then((u) => { if (active) setUser(u && u.id ? u : null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function login(username, password) {
    const u = await API.login(username, password);
    setUser(u);
    return u;
  }

  async function logout() {
    await API.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
