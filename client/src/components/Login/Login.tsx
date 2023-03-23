import React, { useState, useContext } from "react";
import { authUser } from "../../auth/authUser";
import { FlightContext } from "../../stateManagement/FlightContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const { setToken, isLoggedIn, setIsLoggedIn, setUser } =
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
          setIsLoggedIn(!isLoggedIn);
        } else {
          setToken(data.accessToken);
          authUser(data.accessToken, setUser, navigate);
          setIsLoggedIn(!isLoggedIn);
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
      <section className="flex flex-col items-center justify-center h-screen bg-indigo-100">
        <h3 className="text-indigo-800 font-bold text-2xl">Login</h3>
        <form
          onSubmit={(e: React.FormEvent) => handleLogin(e)}
          className="bg-indigo-400 p-8 rounded-lg text-white shadow-md flex flex-col"
        >
          <label className="mb-1" htmlFor="email_input">
            Email
          </label>
          <input
            className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
            placeholder={"Email"}
            id={"email_input"}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <br />
          <label className="mb-1" htmlFor="password_input">
            Password
          </label>
          <input
            className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
            type="password"
            placeholder={"Password"}
            id={"password_input"}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <br />
          <div className="flex flex-row justify-center mb-1">
            <input
              className="mr-2"
              onChange={() => setCheckbox(!checkbox)}
              type="checkbox"
            />
            <span>Remember me</span>
          </div>
          <input
            className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
            type={"submit"}
          />
        </form>
      </section>
    </>
  );
};

export default LoginForm;
