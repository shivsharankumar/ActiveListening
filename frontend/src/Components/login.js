import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import callAPI from "../utils/callApi";
import { useAuth } from "../context/authContext";

export default function Login() {
  const history = useHistory();
  const loggedInUser = localStorage.getItem("user");
  const location = useLocation();
  const auth = useAuth();
  const forgotPassword = useRef(null);
  const { from } = location.state || { from: { pathname: "/" } };
  const error = auth.status === 400;

  useEffect(() => {
    if (loggedInUser === "undefined") {
      localStorage.clear();
    }
    if (loggedInUser !== null) {
      history.push(from.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, loggedInUser]);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const toggleForgotPasswordContainer = () => {
    if (forgotPassword.current.style.display === "block") {
      forgotPassword.current.style.display = "none";
    } else {
      forgotPassword.current.style.display = "block";
    }
  };

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setCredentials((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const handleClickShowPassword = () => {
    setCredentials({ ...credentials, showPassword: !credentials.showPassword });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    });
    callAPI("POST", "login/", body).then((res) => {
      const userName = res.user;
      if (res.status === 200) {
        auth.signin(200, userName);
        history.push(from.pathname);
      } else {
        auth.signin(400, userName);
      }
    });
    auth.signout(() => history.push("/"));
  };
  return (
    <>
      {loggedInUser !== null ? (
        ""
      ) : (
        <>
          <div className="login-page">
            <div>
              <div />
              <div>
                <div className="text-center">
                  <strong className="text-2xl">Login</strong>
                  <h4 className="mt-[1rem] mb-[2rem]">
                    Hey, Enter your details to get sign in to your account
                  </h4>
                </div>

                <div style={{ position: "relative" }}>
                  {auth.status === 400 ? (
                    <p className="login-error">
                      Your username and password did not match. Please try
                      again.
                    </p>
                  ) : (
                    ""
                  )}

                  {from.pathname !== "/" || null ? (
                    <p className="login-error mt-1">
                      Please login to see this page.
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <form
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  <FormControl
                    className="mt-3 mb-2"
                    style={{ width: "100%", marginBottom: "1rem" }}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput
                      error={error}
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={handleChange}
                      name="username"
                      label="username"
                      labelwidth={75}
                    />
                  </FormControl>
                  <FormControl
                    className="mt-3"
                    style={{ width: "100%", marginBottom: "1rem" }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      className="no-bottom-border"
                      error={error}
                      id="password"
                      type={credentials.showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={handleChange}
                      name="password"
                      label="password"
                      labelwidth={70}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {credentials.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  <div className="mb-[1rem]">
                    <span
                      tabIndex="0"
                      role="button"
                      onClick={toggleForgotPasswordContainer}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          toggleForgotPasswordContainer(event);
                        }
                      }}
                    >
                      Having trouble in sign in?
                    </span>

                    <p
                      ref={forgotPassword}
                      style={{ display: "none" }}
                      className="warning-message"
                    >
                      Please contact your system administrator for resetting the
                      password.
                    </p>
                  </div>
                  <button type="submit" value="login" className="sign-in">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
