import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import auth from "./firebase";

interface UserAuthContextProps {
  user: FirebaseUser | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

export const UserAuthContext = createContext<UserAuthContextProps>(null!);

interface UserAuthContextProviderProps {
  children: React.ReactNode;
}

export const UserAuthContextProvider: React.FC<
  UserAuthContextProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    return;
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    return;
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const googleSignIn = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleAuthProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
