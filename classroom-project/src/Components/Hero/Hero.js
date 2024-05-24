import Layout from "../Layout/Layout";
import "./Hero.css";
import { useContext } from "react";
import { UserContext } from "../../UserContext";


export default function Hero(props) {
  const {userInfo}=useContext(UserContext)
  const user=userInfo?.username;
  return (
    <Layout>
      <div style={{marginTop:'58px'}}>
      <div className="Hero" >
        {/* <div className="image">
          <img src="Assets\hero.png"alt="Hero"></img>
        </div> */}
        <div className=" Content text-white">
          <h1 >
            Transforming Education, One Click at a Time
          </h1>
          <hr className=" my-4" />
          <p className="lead">
          Join a community of passionate instructors and eager learners on SkillByte. Whether you're here to teach or to learn, we've got the tools and courses to elevate your skills and knowledge
          </p>
        
       
        <div className="btn-content">
         <a className="custom-btn btn btn-primary btn-lg"
        href= {user ? "/course":'/Login'} 
            role="button">
            Explore Courses <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        </div>
        </div>
        </div>
    </Layout>
  );
}
