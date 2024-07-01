import { Link,useNavigate,Navigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import Layout from "../Components/Layout/Layout";
import {toast}from 'react-hot-toast';

import { useDispatch, useSelector } from "react-redux";
import { LoginUser, fetchUser } from "../Components/Store/UserSlice";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [redirect, setRedirect] = useState();
  const userInfo=useSelector((state)=>state.User.userData)
  const loading=useSelector((state)=>state.User.loading)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  useEffect(() => {
    if (userInfo.token && userInfo.role) {
      redirectUser(userInfo.role);
    }
  }, [userInfo]);
  async function login(ev) {
    ev.preventDefault();
    if(!email||!password){
     return toast.error('Fields cannot be empty'); 
    }
    try{
    const response=await dispatch(LoginUser({email,password}))
      if(response?.payload?.success==='verify'){
         navigate ('/Signup',{state:{user:response?.payload.data}})
        toast.success(response?.payload?.message)
      }else 
      if(response?.payload?.success===true){
        redirectUser(response?.payload?.role);
        toast.success( `Welcome ${response?.payload?.role}`,{theme:'colored',position:'top-center'});
      }  
      else{
        toast.error(response?.payload?.message)
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
        <form className="Login-form" onSubmit={login}>
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
          <button className="Login-button">{loading?'Logging in...':'Login'}</button>
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
