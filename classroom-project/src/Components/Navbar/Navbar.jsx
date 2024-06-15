import "./Navbar.css";
import React, { useContext, useEffect } from "react";
import { NavLink} from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { fetchCourse } from "../Store/CourseSlice";
import {useDispatch,useSelector} from 'react-redux'
import { LoggedIn, LoggedOut } from "../Store/UserSlice";

function Navbar({onIcon}){ 

const dispatch=useDispatch()
const state=useSelector((state)=>state)
const isLoggedIn=state.User.isLoggedIn;
const role=state.User.role

  useEffect(()=>{
   dispatch(LoggedIn())
  },[]);
  
 async function logout(){
    const res=await dispatch(LoggedOut())
    if(res?.payload?.success){
      window.location.href="/";
    }
  }

  
  return (
    <>
      <nav className="Nav navbar navbar-expand-lg navbar-dark bg-dark fixed-top"style={{zIndex:"5"}} >
        <div className="container-fluid">
          {isLoggedIn&&(
        <div className={"menu-bar"}>
        <FiMenu onClick={onIcon}/>
        </div> )}   
          <NavLink className="brand navbar-brand" to="/">
            <span style={{border:'1px solid', borderRadius:'50%',padding:'3px'}}>
              <img src='/Assets/Logo2.png'width='30px'height='20px'alt='skillBites'/></span>
            <span style={{marginTop:'3px', marginLeft:'7px',fontWeight:'bold',fontSize:'24px'}}>SkillBites</span>
          </NavLink>
      
        
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
           
          <div className="collapse navbar-collapse " id="navbarSupportedContent"style={{zIndex:1004}}>
         
            <ul className="navbar-nav mb-2 mb-lg-0 ms-auto  ">
                
              <li className="nav-item li-item">
                <NavLink className="nav-link " to="/">
                 Home
                </NavLink>
              </li>
             
             {role!=='Admin'&&( <li className="nav-item li-item">
                <NavLink className="nav-link " to="/contact">
                Contact
                </NavLink>
              </li>)}
              {isLoggedIn &&(
                <>
             {role!=='Admin'&& <li className="nav-item li-item">
                <NavLink className="nav-link " to="/course"onClick={fetchCourse}>
                  Course List
                </NavLink>
              </li>}
              
                <li className="nav-item li-item">
                <span className="btn btn-md btn-danger " onClick={logout}>Logout</span>
                </li>
                </>
              )}
              {!isLoggedIn &&(
                <>
              <li className="nav-item li-item">
                <NavLink className=" btn btn-md btn-primary  " to="/Login">
                  Login
                </NavLink>
               
              </li>
              <li className="nav-item li-item">
                <NavLink className=" btn btn-md btn-primary " to="/Signup">
                  Signup
                </NavLink>
                
              </li>
              </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
