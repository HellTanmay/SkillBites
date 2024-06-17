import React, { useEffect, useRef } from 'react'
import Layout from '../../Components/Layout/Layout'
import {useSelector,useDispatch}from 'react-redux'
import { approved, deleteCourse, fetchCourse } from '../../Components/Store/CourseSlice'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { RiDeleteBin6Line } from "react-icons/ri";
import TableSkeleton from '../../Extras/TableSkeleton'
import { IoEyeSharp } from "react-icons/io5";

const AdminCourse = () => {
  
function format(formatted){
  const date=new Date(formatted)
return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
  const dispatch=useDispatch()
const courses=useSelector((state)=>state.course.courseData.data)
const loading=useSelector((state)=>state.course.loading)
const navigate=useNavigate()
useEffect(()=>{
  dispatch(fetchCourse())
},[dispatch])

async function click(course,status){
 const res= await dispatch(approved({c_id:course._id,status}))
 if(res.payload.success){
  toast.success(`${course.title} Approved`,{position:'top-center'})
  dispatch(fetchCourse())
 }else{
  toast.error(res.payload.message,{theme:'colored',position:'bottom-right'})
 }

}

async function handleDelete(courseId){
  if(window.confirm('Do u really want to delete this course')){
    const res= await dispatch(deleteCourse(courseId))
  if(res?.payload?.success){
    dispatch(fetchCourse())
    toast.success(res?.payload?.message,{position:'top-center'})
  }
}
}

  return (
    <Layout hideFooter>
      <div className='Course-Dashboard'>
        <h1 className='text-center'>Courses</h1>
        <div className='bars'style={{overflow:'auto',maxHeight:'80vh'}}>
      <table className="table table-light table-hover table-striped">
  <thead className='table-dark fixed-header'>
    <tr>
      <th scope="col">Course-Id</th>
      <th scope="col">Course Name</th>
      <th scope="col">Instructor Name</th>
      <th scope="col">No of students</th>
      <th scope="col">Course price</th>
      <th scope="col">Total Income</th>
      <th scope="col">Created on</th>
      <th scope="col">Approval</th>   
      <th>Action</th>
    </tr>
  </thead>
  { !loading?(
  courses?.length!==0?(<tbody>
   { courses?.map(course=>(
    <tr key={course._id}>
      <th scope="row">{course._id}</th>
      <td>{course.title}</td>
      <td>{course.author.username}</td>
      <td>{course.enrolled.length}</td>
      <td>{course.price}</td>
      <td>{course.price*course.enrolled.length.toString()}</td>
      <td>{format(course.createdAt)}</td>
      <td style={{ textAlign:'center'}}><input style={{cursor:'pointer'}} type='checkbox'checked={course?.approved===true}
      onChange={(e)=>click(course,e.target.checked)}/></td>  
      <td >
      <span style={{marginRight:'20px',padding:'5px',color:'darkblue',fontSize:'14pt',cursor:'pointer'}}><IoEyeSharp onClick={()=>navigate(`/course/${course._id}`)}/></span>
      <span><RiDeleteBin6Line style={{cursor:'pointer',color:'red',fontSize:'14pt'}} onClick={()=>handleDelete(course?._id)}/></span></td>
    </tr>))}
  </tbody>):(
  <tbody>
    <tr>
      <td colspan='9'className='text-center'>No Courses Available</td>
    </tr>
    </tbody>)):(
      <TableSkeleton columns={9}rows={courses?.length}/>
    )}
</table>
</div>  
</div>  
    </Layout>
  )
}

export default AdminCourse
