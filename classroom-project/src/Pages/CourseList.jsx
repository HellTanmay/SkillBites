import { useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import Course from "./Course";
import {useDispatch,useSelector}from 'react-redux';
import { fetchCourse } from "../Components/Store/CourseSlice";

export default function CourseList(){
    const dispatch=useDispatch();
     const state=useSelector((state)=>state)
    const courses=state?.course?.courseData.data
useEffect(()=>{
    dispatch(fetchCourse())
},[dispatch])

    return(
        <>
       <Layout>
        <div className="course-container">
        <div className=" course-heading d-flex"style={{justifyContent:'space-between'}}>
        <img src="Assets/course2.png" width='580px'alt='pic'></img>
        <img style={{marginTop:'-40px'}}src="Assets/course.png" width='500px' height='500px'alt='pic'></img>
        </div>
        <div style={{width:'100%',background:'white',height:'50px',paddingBottom:'10px',}}>
        <h1 style={{textAlign:'center',color:"black",fontFamily:'angkor',padding:''}}>All Courses</h1>
        </div>
        <div className="course">
            <div className="row gap-4 m-5">
              
                {courses?.length>0?courses?.map(course=>(
                    <Course {...course}source='allCourse'/>
                )):(
                    <div className="d-flex justify-content-center">
                        <h4>No courses are available yet</h4>
                    </div>
                )}
        </div>
        </div>
        </div>
        </Layout>
        
        </>
    )
}