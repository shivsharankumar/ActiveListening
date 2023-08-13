import React, { useContext, createContext, useState } from "react";

/* `const authContext = createContext();` is creating a new context object called `authContext`.
Context provides a way to pass data through the component tree without having to pass props down
manually at every level. The `createContext()` function returns an object with two components:
`Provider` and `Consumer`. The `Provider` component is used to provide the context value to its
descendants, while the `Consumer` component is used to access the context value within a component. */
const authContext = createContext();

/**
 * The function returns the authentication context.
 * @returns The `useAuth` function is returning the value of the `authContext` that is being accessed
 * through the `useContext` hook.
 */
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

/**
 * The AuthProvider function is a React component that wraps its children with an authentication
 * context provider.
 * @returns The `AuthProvider` component is returning a `authContext.Provider` component with the
 * `auth` value provided by the `useAuthProvider` hook as its value prop. The `children` prop is also
 * being rendered as the children of the `authContext.Provider` component.
 */
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
