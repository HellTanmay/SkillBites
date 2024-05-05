import  { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../Components/Store/UserSlice'

const AdminStudent = () => {
    const dispatch=useDispatch()
    const userData=useSelector((state)=>state.User.userData.data)
    useEffect(()=>{
        dispatch(fetchAllUsers())
      },[])
      console.log(userData)
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
   <Layout hideFooter={true}initial={true} >
          <div className='Course-Dashboard'>
        <h1 className='text-center'>Students</h1>
      <table className="table  table-light table-hover table-striped">
  <thead className='table-dark'>
    <tr>
      <th scope="col">Student_id</th>
      <th scope="col">Student</th>
      <th scope="col">Student Email</th>
      <th>Gender</th>
      <th scope="col">Course Purchased</th>
      <th scope="col">Joined on</th>   
    </tr>
  </thead>
  {userData?.length!==0?<tbody>
    {userData?.map(user=>(
    <tr key={user.user._id}>
      <th scope="row">{user.user._id}</th>
      <td><img src={user.user.photo}width='40px'height='40px'className='profile-pic'alt='profile'/>{user.user.username}</td>
      <td>{user.user.email}</td>
      <td>{user.user.gender}</td>
      <td>
  {user.purchases &&user.purchases.length>0? (
    <ol>
      {user.purchases.map((course, index) => (
        <li key={index}>{course?.courseId?.title}</li>
      ))}
    </ol>
  ):(<span style={{marginLeft:'50px'}}>-</span>)}
</td>
      <td>{format(user?.user?.createdAt).date +' at '+format(user.user.createdAt).time}</td>
    
    </tr>))}
  </tbody>: <tbody>
            <tr>
              <td colSpan="7" className="text-center">No Students available</td>
            </tr>
          </tbody>}
</table>
</div>  
    </Layout>
  )
}

export default AdminStudent
