import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { signUpUser, signInUser, signOutUser } from '../firebase/auth';
import { getUserData } from '../firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const { data } = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    return await signUpUser(email, password);
  };

  const login = async (email, password) => {
    return await signInUser(email, password);
  };

  const logout = async () => {
    return await signOutUser();
  };

  /**
   * Re-fetch userData from Firestore.
   * Call this after profile edits or credit changes.
   */
  const refreshUserData = async () => {
    if (currentUser) {
      const { data } = await getUserData(currentUser.uid);
      setUserData(data);
    }
  };

  /**
   * Get a fresh Firebase ID token for backend API calls.
   * Tokens are auto-refreshed by Firebase but this ensures a valid one.
   */
  const getIdToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    refreshUserData,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
