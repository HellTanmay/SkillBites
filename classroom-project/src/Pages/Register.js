import { useState,useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

export default function Register() {
  const [redirect,setRedirect]=useState(false);
  const{setUserInfo}=useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };
 
  async function register(ev) {
    ev.preventDefault();
  
    if(!formData.email||!formData.username||!formData.password){
      toast.error('All fields are mandatory');
    }
     try{
   const response= await fetch("http://localhost:4000/Signup",{
      method:'Post',
      body:JSON.stringify({...formData,role:selectedRole}),
      headers:{'Content-Type':'application/json'},
      credentials: "include",
    })
  
    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
    } 
    else {
      await response.json().then(userInfo=>{
        setUserInfo(userInfo.token);
        setRedirect(true);
        toast.success('Registered Successfully',{theme:'colored',position:'top-center'});
      })
    }
  } catch(err){
    console.log(err.message)
  }
  }
  if(redirect){
    return(<Navigate to={'/'}/>)
   
  }


  return (
    <>
      <Layout>
      <div className="login-container">
        <div className="member">
    
          <form className="Register" onSubmit={register}>
            <h1>Register</h1>
          {!selectedRole&& <> <div className="role">
          <p>Student
              <input type="image"alt='Student' src="https://img.freepik.com/free-vector/man-studying-with-book-illustration-isolated_24911-115018.jpg?size=626&ext=jpg&ga=GA1.1.1799944211.1707725387&semt=sph"
              width='150px' onClick={()=>handleRoleSelection('Student')}/>
         </p>  {' '}  
         <p>Instructor
              <input type="image"alt='Instructor' src="https://img.freepik.com/free-vector/flat-teachers-day-background_23-2149077610.jpg?t=st=1710238212~exp=1710241812~hmac=bc128e42de8a56142af75f29916ee1792dad21a838e47be98db0b9ad216f1b1d&w=996"
              width='170px' height='150px' onClick={()=>handleRoleSelection("Instructor")}/>
            </p>
            </div>
            <h5>Sign in as a student or an Intructor?</h5>
          </>}
           {selectedRole&&<> <input
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
            <br />
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
        </div>
        </div>
      </Layout>
    </>
  );
}
