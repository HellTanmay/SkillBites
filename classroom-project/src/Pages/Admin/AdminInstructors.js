import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../Components/Store/UserSlice'

const AdminInstructors = () => {
    const dispatch=useDispatch()
    const instructors=useSelector((state)=>state.User.userData.data2)
    useEffect(()=>{
        dispatch(fetchAllUsers())
    },[])
    
    function format(formatted){
        const date=new Date(formatted)
      const dateType= date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        
      const timeType= date.toLocaleTimeString('en-IN', {
          hour:'2-digit',
          minute:'2-digit'
        });
        return {date:dateType,
               time:timeType}
      }
  return (
   <Layout hideFooter={true}initial={true}>
           <div className='Course-Dashboard'>
        <h1 className='text-center'>Instructors</h1>
      <table className="table  table-light table-hover table-striped">
  <thead className='table-dark'>
    <tr>
      <th scope="col">Instructor_id</th>
      <th scope="col">Instructor</th>
      <th scope="col">Instructor Email</th>
      <th scope="col">Gender</th>
      <th scope="col">Created Courses</th>
      <th scope="col">Joined on</th>   
    </tr>
  </thead>
  {instructors?.length!==0? <tbody>
    {instructors?.map(user=>(
    <tr key={user.instructor._id}>
      <th scope="row">{user.instructor._id}</th>
      <td><img src={user.instructor.photo}loading='lazy'width='40px'height='40px'className='profile-pic'alt='profile'/>{user.instructor.username}</td>
      <td>{user.instructor.email}</td>
      <td>{user.instructor.gender}</td>
      <td>
  {user.courses &&user.courses.length>0? (
    <ol>
      {user.courses.map((course, index) => (
        <li key={index}>{course.title}</li>
      ))}
    </ol>
  ):(<span style={{marginLeft:'50px'}}>-</span>)}
</td>
      <td>{format(user.instructor.createdAt).date +' at '+format(user.instructor.createdAt).time}</td>
    
    </tr>))}
  </tbody>:
  <tbody>
    <tr>
      <td colspan='6'className='text-center'>No Instructors Available</td>
    </tr>
    </tbody>}
</table>
</div>
    </Layout>
  )
}

export default AdminInstructors
