import React, {useState, useEffect, useContext, createContext} from 'react';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@firebase/auth";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app, auth } from "@/constants/firebase";
import { UserModel } from '@/core/models/UserModel';
import { getUserById } from '@/core/services/user';


interface AuthContextProps{
    authenticated: boolean;
    error: string;
    auth: Auth;
    user: UserModel;
    setAuthenticated?: (value: boolean) => void;
    setError?: (value: string) => void;
    login: (email: string, password: string) => void;
    register: (email: string, password: string, name:string, phone:number) => void;
    logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: {children: React.ReactNode}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<UserModel>({} as UserModel);
    
    const firestore = getFirestore(app);
    const usersColl = collection(firestore, "/user");

    useEffect(() => {
        setError("");
    }, []);

    const login = async (email: string, password: string) => {
        setError("");
        try {
            const loggedUser = await signInWithEmailAndPassword(auth, email, password);
            setUser(await getUserById(loggedUser.user.uid) as UserModel);

        } catch (error:any) {
            setError(error.message);
        }
    }

    const register = async (email:string, password:string, name:string, phone:number) => {
        setError("");
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;
            const newUser = {
                uid,
                name,
                phone,
            }

            await addDoc(usersColl, newUser);
            setUser(await getUserById(uid) as UserModel);

        } catch (error:any) {
            setError(error.message);
        }
    }

    const logout = async () => {
        try{
            await signOut(auth);
        } catch (error:any) {
            setError(error.message);
        }
    }

    return (
        <AuthContext.Provider value={{authenticated, setAuthenticated, error, setError, auth, login, register, logout, user}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAppAuth = () => useContext(AuthContext);


