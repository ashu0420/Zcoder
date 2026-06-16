import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    return (<AuthContext.Provider value={{ token, setToken, userId, setUserId ,user,setUser,email,setEmail}}>
        {children}
    </AuthContext.Provider>);
}

export const useAuth = () => useContext(AuthContext);