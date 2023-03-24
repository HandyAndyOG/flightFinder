import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showRegisterMessage = () => {
  toast.success("Registered Successfully!", {
    position: toast.POSITION.BOTTOM_CENTER,
  });
};
const showRegisterMessageFailed = () => {
  toast.error("Registration Failed!", {
    position: toast.POSITION.BOTTOM_CENTER,
  });
};

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (confirmPassword === password) {
    fetch(`${process.env.REACT_APP_URL}api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password})
    })
        .then(response => response.json())
        .then(data => {return (data.status === 'success' ? showRegisterMessage() : showRegisterMessageFailed())})
        .catch(err => console.log(err))
        .finally(() => {
          setTimeout(() => {
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            navigate('/login')
          }, 2000)
        })
    } 
    return
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-indigo-100">
      <h3 className="text-indigo-800 font-bold text-2xl">Register</h3>
      <form className="bg-indigo-400 p-8 rounded-lg text-white shadow-md flex flex-col" onSubmit={(e:  React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <label className="mb-1" htmlFor="email_input">Email</label>
        <input className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900" required placeholder={"email"} id={"email_input"} value={email} onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <label className="mb-1" htmlFor="password_input">Password</label>
        <input className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900" required type='password' placeholder={"password"} id={"password_input"} value={password} onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <label className="mb-1" htmlFor="confirmed_password_input">Confirm password</label>
        <input className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900" required type='password' placeholder={"confirm password"} id={"confirmed_password_input"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        <br/>
        <input className="cursor-pointer border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1" type={'submit'}/>
      </form>
      <ToastContainer />
    </section>
)
}

export default Register