import { createContext, useContext, useEffect, useState } from "react";

export interface User {
    user: string,
    user_id: number,
    admin: boolean,
};

export interface UserContext {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    user?: User,
};

const AuthContext = createContext<UserContext>({
    auth: false,
    setAuth: (auth: boolean) => {},
});

const useAuth = () => useContext(AuthContext);
export {useAuth};

const AuthProvider = ({children}: any) => {
    
    const [auth, setAuth] = useState<boolean>(sessionStorage && sessionStorage.getItem('login') != null);
    const [user, setUser] = useState<User>(sessionStorage && sessionStorage.getItem('login') && JSON.parse(sessionStorage.getItem('login')!));

    useEffect(() => {
        if (sessionStorage && sessionStorage.getItem('login')) {
            setUser(JSON.parse(sessionStorage.getItem('login')!));
        }
    }, [auth]);

    return (<AuthContext.Provider value={{ auth, setAuth, user }}>
        {children}
    </AuthContext.Provider>);
};

export default AuthProvider;