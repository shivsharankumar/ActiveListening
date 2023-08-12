import React, { useContext, createContext, useState } from "react";

const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState(null);

  const signin = (statusValue, userName) => {
    localStorage.setItem("user", userName);
    setUserName(userName);
    setUser(userName);
    setStatus(statusValue);
  };

  const signout = (fn) => {
    setUser(null);
    fn();
  };

  return {
    user,
    userName,
    status,
    signin,
    signout,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
