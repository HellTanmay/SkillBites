import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Layout from "../Components/Layout/Layout";
import { UserContext } from "../UserContext";
import {toast}from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [redirect, setRedirect] = useState();
  const{setUserInfo,userInfo}=useContext(UserContext);
  useEffect(() => {
    if (userInfo.token && userInfo.role) {
      // If user info is available and role is present, redirect
      redirectUser(userInfo.role);
    }
  }, [userInfo]);
  async function login(ev) {
    ev.preventDefault();
    if(!email||!password){
     return toast.error('Fields cannot be empty'); 
    }
    try{
    const response = await fetch("http://localhost:4000/Login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
    } 
    else {
      const user=await response.json()
        await setUserInfo(user.token);
        redirectUser(user.role);
        toast.success( `Welcome ${user.role}`,{theme:'colored',position:'top-center'});
  }
 
  }
    catch(err){
    console.log(err.message)
  }
    }

function redirectUser(role){
if(role!=='Admin'){
  setRedirect('/')
}else{
setRedirect('/Admin/Dashboard')
}
}
if(redirect){
  return <Navigate to={redirect}/>
}

  return (
    <Layout>
      <div className="login-container">
      <div className="member">
        <form className="Login" onSubmit={login}>
          <h1>Login</h1>
          <input
            className="text"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <br />
          <input
            className="text"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <br />
          <button className="Login-button">Login</button>
          <br />
          <br />
          <p>
            Dont have an account? <Link to="/SignUp" style={{textDecoration:"none" ,color:"red"}}>Signup now</Link>
          </p>
        </form>
      </div>
      </div>
    </Layout>

  );
}
