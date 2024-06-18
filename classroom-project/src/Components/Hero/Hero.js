import { useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import "./Hero.css";
import { Link } from "react-router-dom";


export default function Hero() {

  const user = useSelector((state)=>state.User.isLoggedIn)
  const loading=useSelector((state)=>state.User.loading)
  return (
    <Layout>
      
      <div style={{ marginTop: "58px",minHeight:'78dvh' }}>
      {!loading?(
        <div className="Hero">
       
          <div className=" Content text-white">
            <h1>Transforming Education, One Click at a Time</h1>
            <hr className=" my-4" />
            <p className="lead">
              Join a community of passionate instructors and eager learners on
              SkillByte. Whether you're here to teach or to learn, we've got the
              tools and courses to elevate your skills and knowledge
            </p>
            <div className="btn-content">
              <Link className="btn btn-primary btn-lg" to={user?'/course':'/Login'}>
                Explore Courses <i className="fa-solid fa-arrow-right"></i>
             </Link>
            </div>
            {/* <div className="profile">
            <img src="/Assets/Logo.png" width='400px'/>
            </div> */}
          </div>
        </div>):(<div className="d-flex justify-content-center align-items-center "style={{height:'30rem'}}>
            wait a moment...
            </div>)}
      </div>
    </Layout>
  );
}
