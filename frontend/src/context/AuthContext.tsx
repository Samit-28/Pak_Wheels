import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContextValue';
import type { User } from './AuthContextValue';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

