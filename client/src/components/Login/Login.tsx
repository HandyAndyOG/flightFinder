import React, { useState, useContext } from "react";
import { authUser } from "../../auth/authUser";
import { FlightContext } from "../../stateManagement/FlightContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const { token, setToken, isLoggedIn, setIsLoggedIn, setUser } =
    useContext(FlightContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (checkbox) {
            setToken(data.accessToken);
            localStorage.setItem("token", data.accessToken);
            authUser(data.accessToken, setUser, navigate);
            setIsLoggedIn(!isLoggedIn)
          } else {
            setToken(data.accessToken);
            authUser(data.accessToken, setUser, navigate);
            setIsLoggedIn(!isLoggedIn)
          }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoginEmail("");
        setLoginPassword("");
        setCheckbox(false);
      });
  };
  return (
    <>
      <section>
        <h3>Login</h3>
        <form
          onSubmit={(e: React.FormEvent) => handleLogin(e)}
          className={"login_form"}
        >
          <label htmlFor="email_input">Email</label>
          <input
            placeholder={"email"}
            id={"email_input"}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password_input">Password</label>
          <input
            type="password"
            placeholder={"password"}
            id={"password_input"}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <br />
          <input onChange={() => setCheckbox(!checkbox)} type="checkbox" />
          <span>Remember me</span>
          <input type={"submit"} />
        </form>
      </section>
    </>
  );
};

export default LoginForm;
