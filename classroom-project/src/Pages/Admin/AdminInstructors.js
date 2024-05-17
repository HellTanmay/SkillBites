import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../Components/Store/UserSlice'
import TableSkeleton from '../../Extras/TableSkeleton'

const AdminInstructors = () => {
    const dispatch=useDispatch()
    const instructors=useSelector((state)=>state.User.userData.data2)
    const loading=useSelector((state)=>state.User.allLoading)
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
   <Layout hideFooter>
           <div className='Course-Dashboard'>
        <h1 className='text-center'>Instructors</h1>
        <div className='bars'style={{overflow:'auto',maxHeight:'80vh'}}>
      <table className="table  table-light table-hover table-striped">
  <thead className='table-dark fixed-header'>
    <tr>
      <th scope="col">Instructor_id</th>
      <th scope="col">Instructor</th>
      <th scope="col">Instructor Email</th>
      <th scope="col">Gender</th>
      <th scope="col">Created Courses</th>
      <th scope="col">Joined on</th>   
    </tr>
  </thead>
  {!loading?(
  instructors?.length!==0?( <tbody>
    {instructors?.map(user=>(
    <tr key={user.instructor._id}>
      <th style={{width:'100px'}} scope="row">{user.instructor._id}</th>
      <td style={{width:'200px'}}><img src={user.instructor.photo}loading='lazy'width='40px'height='40px'className='profile-pic'alt='profile'/>
      {user.instructor.username}</td>
      <td >{user.instructor.email}</td>
      <td style={{width:'50px'}}>{user.instructor.gender}</td>
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
  </tbody>):(
  <tbody>
    <tr>
      <td colspan='6'className='text-center'>No Instructors Available</td>
    </tr>
    </tbody>)):(
      <TableSkeleton columns={6} rows={instructors?.length}/>
    )}
</table>
</div>
</div>
    </Layout>
  )
}

export default AdminInstructors
