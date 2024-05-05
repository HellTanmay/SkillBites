
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../Components/Store/UserSlice'
import { fetchPerformance } from '../../Components/Store/CourseSlice'
import { useParams } from 'react-router-dom'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Certificate from './Certificate'

const Performance = () => {
  let count=0
  const dispatch=useDispatch()
  const User=useSelector((state)=>state.User.userData)
  const performance=useSelector((state)=>state.course.performanceStats)
  const allPerformance=useSelector((state)=>state.course.performanceStats.studentsPerformance)
  const percentage=Math.floor(performance.studentPerformance*100)/100
  console.log(allPerformance)
  const {id}=useParams()
  useEffect(()=>{
    dispatch(fetchUser())
    dispatch(fetchPerformance(id))
  },[])
  function format(formatted){
    const date=new Date(formatted)
  return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  return (
    <div className='performance-container'>
   {User.role==='Student'&&( <> <h1>Html/css/Javascript</h1>
      <p>No of lectures:<span>{performance.noOfLectures}</span></p>
      <p>No of assignments:<span>{performance.noOfAssignments}</span></p>
      <div className=''>
             <Certificate/>
            </div>
      <div className='performance-details'>
            <h3>Your Performance</h3>
            <div style={{width:'100px'}}>
            <span><CircularProgressbar styles={
              buildStyles({textColor:'green',pathColor:'green'})}
              value={percentage} text={`${percentage}%`} /></span>
            </div>
           
      </div></>)} 
      
     {User.role==='Instructor'&&
     <div className='student-performance'>
      <table class="table  table-striped">
  <thead className=" table-dark">
    <tr>
      <th scope="col">SL.No</th>
      <th scope="col">Student</th>
      <th scope="col">Student Email</th>
      <th scope="col">Date of join</th>
      <th scope="col">Student performance</th>
    </tr>
  </thead>
  {allPerformance?.length!==0?<tbody>
   {allPerformance?.map(performance=><tr>
        <th scope="row">{count=count+1}</th>
      <td><img src={performance.profile}width='40px'height='40px'className='profile-pic' alt='profile'/>{performance.name}</td>
      <td>{performance.email}</td>
      <td>{format(performance?.joined)}</td>
      <td>{performance.percentage?.toFixed(2)+'%'}</td> 
    </tr>)}
    </tbody>:
    <tbody>
    <tr>
      <td colSpan="7" className="text-center">No Students available</td>
    </tr>
  </tbody>}
    
    </table>
      </div>}
  
    </div>
  )
}

export default Performance
