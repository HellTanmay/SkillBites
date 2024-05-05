import "./Navbar.css";
import React, { useContext, useEffect } from "react";
import { NavLink} from "react-router-dom";
import {FaHome} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { UserContext } from "../../UserContext";
import { fetchCourse } from "../Store/CourseSlice";

function Navbar({onIcon}){ 

const{setUserInfo,userInfo}=useContext(UserContext);
  useEffect(()=>{
    fetch('http://localhost:4000/verify',{
      credentials:'include',
    }).then((response)=>{
      response.json().then((userInfo)=>{
            setUserInfo(userInfo);
      });
    });
  },[]);
  
  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method:'POST',
    });
    setUserInfo(null);
    window.location.href="/";
  }
const username=userInfo?.username;
const role = userInfo?.role;
  return (
    <>
    
      <nav className="Nav navbar navbar-expand-lg navbar-dark bg-dark fixed-top"style={{zIndex:"5"}} >
        <div className="container-fluid">
          {username&&(
        <div className={"menu-bar"}>
        <FiMenu onClick={onIcon}/>
        </div> )}   
          <NavLink className="brand navbar-brand" to="/">
            <span style={{border:'1px solid', borderRadius:'50%',padding:'3px'}}>
              <img src='/Assets/Logo2.png'width='30px'height='20px'alt='skillBites'/></span>
            <span style={{marginTop:'3px', marginLeft:'7px',fontWeight:'bold',fontSize:'24px'}}>SKILL BITES</span>
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
         
            <ul className="navbar-nav mb-2 mb-lg-0 ms-auto ">
            
                
              <li className="List-item">
                <NavLink className="nav-link li-item" to="/">
                <FaHome/> Home
                </NavLink>
              </li>
             
             {role!=='Admin'&&( <li className="List-item">
                <NavLink className="nav-link li-item" to="/contact">
                Contact
                </NavLink>
              </li>)}
              {username &&(
                <>
             {role!=='Admin'&& <li>
                <NavLink className="nav-link li-item" to="/course"onClick={fetchCourse}>
                  Course List
                </NavLink>
              </li>}
              
                <li>
                <span className="btn btn-md btn-danger li-item" onClick={logout}>Logout</span>
                </li>
                </>
              )}
              {!username &&(
                <>
              <li>
                <NavLink className=" btn btn-md btn-primary li-item" to="/Login">
                  Login
                </NavLink>
               
              </li>
              <li>
                <NavLink className=" btn btn-md btn-primary li-item" to="/Signup">
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
