import { useState,useContext, useEffect } from "react";
import { Link, Navigate,useLocation } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerUser, resendOtp, verifyEmail } from "../Components/Store/UserSlice";

export default function Register() {
  const [redirect,setRedirect]=useState(false);
  const [Regstate,setRegState]=useState('role')
  const [otp,setOtp]=useState()
  const [tokenData, setTokenData] = useState();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role:'',
  });
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const dispatch=useDispatch()
   const location = useLocation()

  useEffect(() => {
    if (location.state) {
      const { user} = location.state;
      
      setTokenData(user);
      setRegState('otp');
    }
  }, [location.state]);



  const handleRoleSelection = (role) => {
    setFormData({...formData,role})
    setRegState('register')
  };
 
  async function register(ev) {
    ev.preventDefault();
     try{
      const res=await dispatch(registerUser(formData))
    if(res?.payload?.success){
      setTokenData(res?.payload?.data)
      toast.success(res?.payload.message)

      setRegState('otp')
    }else{
      toast.error(res?.payload?.message)
    }
   
  } catch(err){
    console.log(err.message)
  } 
  }
  console.log(tokenData)

async function verifyOtp(ev){
  ev.preventDefault();
  try {
    const email=tokenData.email
    const res=await dispatch(verifyEmail({email,otp}))
    if(res?.payload?.success){
      setRedirect(true)
      toast.success(res.payload.message)
    }
    else{
      toast.error(res.payload.message)
    }
  } catch (error) {
    console.log(error)
  }
}
async function resend(ev){
  ev.preventDefault();
  try {
    const email=tokenData.email
    const user_id=tokenData._id
    const res=await dispatch(resendOtp({user_id,email}))
    if(res?.payload?.success){
      toast.success(res.payload.message)
    }
    else{
      toast.error(res.payload.message)
    }
  } catch (error) {
    console.log(error)
  }
}
   if(redirect){
    return <Navigate to='/'></Navigate>
   } 


  return (
    <>
      <Layout>
      <div className="login-container">
        {Regstate!=='otp'&&
        <div className="member">
          <form className="Register-form" onSubmit={register}>
            <h1>Register</h1>
          {Regstate==='role'&& <> 
            <div className="role">
              <div className="student d-flex flex-column">
            
              <input type="image"alt='Student' src="https://img.freepik.com/free-vector/man-studying-with-book-illustration-isolated_24911-115018.jpg?size=626&ext=jpg&ga=GA1.1.1799944211.1707725387&semt=sph"
              width='160px' height='150px' onClick={()=>handleRoleSelection('Student')}/> 
                <p>Student</p> 
              </div>
              <div className="Instructor d-flex flex-column">
              <input type="image"alt='Instructor' src="https://img.freepik.com/free-vector/flat-teachers-day-background_23-2149077610.jpg?t=st=1710238212~exp=1710241812~hmac=bc128e42de8a56142af75f29916ee1792dad21a838e47be98db0b9ad216f1b1d&w=996"
              width='170px' height='150px' onClick={()=>handleRoleSelection("Instructor")}/>
              <p>Instructor</p>
             </div>
            </div>
            <h5>Sign in as a Student or an Instructor?</h5>
          </>}
   
           {Regstate==='register'&&<> 
           <input
              className="text"
              name="username"
              type="text"
              placeholder="Enter name"
              value={formData.username}
              onChange={changeHandler}
            />
            <br />

            <input
              className="text"
              name="email"
              type="text"
              placeholder="Enter email"
              value={formData.email}
              onChange={changeHandler}
            />
           
            <input
              className="text"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={changeHandler}
            />
            <br />
            <br />
            <button className="Login-button">Register</button>
            <br />
            <br />
            <p>
              Already have an account? <Link to="/Login"style={{textDecoration:"none" ,color:"red"}}>Login </Link>
            </p></>}
        
          </form>
          
        </div>}
        {Regstate==='otp'&& 
        <div className="otp">
            <form onSubmit={verifyOtp} >
              <input type="number"className="text"
              value={otp}
              placeholder='Enter otp'
              onChange={(e)=>setOtp(e.target.value)}></input>
              <button type="submit" className="Login-button">Verify Otp</button>
              <div className="resend-otp d-flex justify-content-around">
              <span>Didn't recieve any otp?</span>
             <button onClick={resend} className="btn btn-sm btn-primary">Resend otp</button>
              </div>
              </form>
              </div>
              }
        </div>
      
      </Layout>
    </>
  );
}
