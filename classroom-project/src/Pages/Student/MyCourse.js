import React, { useEffect } from 'react'
import Course from '../Course'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCourse } from '../../Components/Store/CourseSlice';
import Layout from '../../Components/Layout/Layout';
import { Link } from 'react-router-dom';
import { fetchUser } from '../../Components/Store/UserSlice';

export default function MyCourse() {
    const dispatch=useDispatch();
    const state=useSelector((state)=>state)
   const courses=state?.course?.MycourseData.data
   const loading=state?.course?.loading
   const role=state?.User?.role
useEffect(()=>{
 dispatch(fetchMyCourse())
 dispatch(fetchUser())
},[dispatch])


  return (
    <Layout>
    <div className='course'style={{minHeight:'77vh', marginTop:'68px'}}>
    <div style={{width:'100%',height:'50px',paddingBottom:'10px',}}>
    <h1 style={{textAlign:'center',color:"black",fontFamily:'angkor',padding:''}}>My Courses</h1>
    </div>
    {!loading?(
    courses?.length>0 ?(<div className=''>
        <div className="row gap-4 m-5">
             {courses?.map(course=>(
                <Course {...course} source='myCourse'/>
            ))}
        </div>
    </div>):(
       <div className='no-Orders'>
       <h4 className='mb-3'>You Dont have any courses</h4>
       <p className='d-flex'><Link to={role==='Student'?'/course':'/create'} className='btn btn-primary'>{role==='Student'?'Browse Courses':'Create course'}</Link></p>
       </div>
    )):(
      <div className="no-Orders">
                  <div className="spinner-border"style={{  }}role="status"> </div>
                  <span className="">fetching courses...</span>
                </div>
    )}
    </div>
    </Layout>
  )
}


