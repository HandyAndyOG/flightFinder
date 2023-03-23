import React, { useState } from 'react'
import { useEffect } from 'react'

const NewUserForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  const [postID, setPostID] = useState(null)

  const handleSubmit = (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (confirmPassword === password) {
    fetch(`${process.env.REACT_APP_URL}api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, role: role })
    })
        .then(response => response.json())
        .then(data => setPostID(data.body.id))
        .catch(err => console.log(err))
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('user')
    } 
    return
  }

  return (
    <>
      <h3>Create new user</h3>
      <form onSubmit={(e:  React.FormEvent<HTMLFormElement>) => handleSubmit(e)} className={"create_user_form"}>
        <label htmlFor="email_input">Email</label>
        <input required placeholder={"email"} id={"email_input"} value={email} onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <label htmlFor="password_input">Password</label>
        <input required type='password' placeholder={"password"} id={"password_input"} value={password} onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <label htmlFor="confirmed_password_input">Confirm password</label>
        <input required type='password' placeholder={"confirm password"} id={"confirmed_password_input"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        <br/>
        <label htmlFor="type_input">Type of User</label>
        <select placeholder={"user"} id={"type_input"} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value={"user"}>User</option>
          <option value={"admin"}>Admin</option>
        </select>
        <br/>
        <input type={'submit'}/>
      </form>
    </>
)
}

export default NewUserForm