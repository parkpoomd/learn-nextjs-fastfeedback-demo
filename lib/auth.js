import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from './firebase';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signInWithGithub = () => {
    return signInWithPopup(getAuth(), new GithubAuthProvider()).then(
      (result) => {
        setUser(result.user);
        return result.user;
      }
    );
  };

  const signout = () => {
    return signOut(getAuth()).then(() => {
      setUser(false);
    });
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithGithub,
    signout
  };
}
