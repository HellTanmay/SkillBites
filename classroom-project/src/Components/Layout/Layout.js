import React from "react";
import {  NavLink } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import "./Layout.css";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdPerson} from "react-icons/io";
import { useState, useEffect, useContext  } from "react";
import { Data, StudentData, TeachData } from "../../Extras/SidebarData";
import {useDispatch,useSelector} from 'react-redux';
import { fetchUser } from "../Store/UserSlice";


export default function Layout({ children ,hideFooter,initial=false,index=true}) {
  const [sidebar, setSidebar] = useState(initial);
  const show = () => setSidebar(!sidebar);
  
  const state=useSelector((state)=>state)
  const user=state.User.userData
  const role=state.User.role
  const loading=state.User.loading

 const dispatch=useDispatch()
 useEffect(()=>{
  dispatch(fetchUser())
 },[dispatch])


 
  return (
    <>
      <Navbar onIcon={show} />

      <nav className={sidebar ? "nav-menu active" : "nav-menu"}
        style={{ top: 0,bottom:index?'0':'200px'}}>
        <ul className="nav-menu-items" onClick={show}>
          <NavLink className="menu-bar-close">
            <AiOutlineClose />
          </NavLink>
          
          {role === "Admin" && (
            <>
              <h4 className="text-white mt-4 "style={{textAlign:'center'}}>Admin Dashboard</h4>
              {Data.map((val, key) => (
                <li className= "row1" key={key}>
                  <NavLink to={val.Link}>
                    <span className="side-icons">{val.icon}</span>
                    <span>{val.title}</span>
                  </NavLink>
                </li>
              ))}
            </>
          )}
          {role === "Student" && (
            <>
             <h4 className="text-white mt-4 "style={{textAlign:'center'}}>Student Dashboard</h4>
             <div className="pro">
             <img src={!loading&&user?.photo}width="100px" alt='profile' height='100px'style={{borderRadius:'50%', marginLeft:'40px',objectFit:'cover'}} loading='lazy'></img>
             <p style={{color:'white',marginTop:'10px',textAlign:'center'}}><IoMdPerson style={{marginTop:'-5px'}}/>{' '}{!loading&&user?.username}</p>
             </div>
             <hr/>
              {StudentData.map((val, key) => (
                <li className= "row1" key={key}>
                  <NavLink to={val.Link}>
                  <span className="side-icons">{val.icon}</span>
                    <span>{val.title}</span>
                  </NavLink>
                </li>
              ))}
            </>
          )}
          {role === "Instructor" && (
            <>
             <h4 className="text-white mt-4 "style={{textAlign:'center'}}>Instructor Dashboard</h4>
             <div className="pro">
             <img src={user?.photo}width="100px" alt='profile' height='100px'style={{borderRadius:'50%', marginLeft:'40px',objectFit:'cover'}}></img>
             <p style={{color:'white',marginTop:'10px',textAlign:'center'}}><IoMdPerson style={{marginTop:'-5px'}}/>{' '}{user?.username}</p>
             </div>
              {TeachData.map((val, key) => (
                <>
                <li className="row1" key={key}>
                  <NavLink to={val.Link}>
                  <span className="side-icons">{val.icon}</span>
                    <span>{val.title}</span>
                  </NavLink>
                </li>
                </>
              ))}
             
            </>
          )}
        </ul>
      </nav>
      <div style={{
          transition: " 350ms ease",
        }}>
        {children}
      </div>
    
     {!hideFooter&&( <Footer
        style={{
          transition: " 350ms ease",
        }}
      />)}
    </>
  );
}
