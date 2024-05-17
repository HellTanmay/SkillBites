import './Admin.css'
import Layout from '../../Components/Layout/Layout';
import {Chart as ChartJS,ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,} from 'chart.js/auto'
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchStats } from '../../Components/Store/ExtraSlice';
import { BsGraphUpArrow } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { TbHexagonLetterC } from "react-icons/tb";

const AdminDashboard = () => {
  const dispatch=useDispatch()
  const stats=useSelector((state)=>state.Extras.stats)
  const loading=useSelector((state)=>state.Extras.loading)
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );
  const userData={
    labels:["Students","Instructors"],
    data:[40],
    datasets:[{
      label:"Users",
      data:[stats?.studentCount,stats.instructorCount]
    }], 
  }
  useEffect(()=>{
    dispatch(fetchStats())
  },[])
  return (
    
      <Layout hideFooter={true} initial={true}>
        {stats&& <div className='dashboard'>
          <div className='heading'>
            <h1>Admin Dashboard</h1>
            </div>
            <div className='cards'>
            <div className='dashboard-cards'>
              <div className='dashboard-card'>
                  <div className='card-head'>
                    <h2><FaUsers className='adminIcons'/> Total Users</h2>
                  </div>
                  <div className={loading?'skeleton':'card-content'}>
                <span>{!loading?stats.instructorCount+stats.studentCount:""}</span>
              </div>
              </div>
              <div className='dashboard-card'>
                  <div className='card-head'>
                    <h2><TbHexagonLetterC className='adminIcons'/> Courses</h2>
                  </div>
                  <div className={loading?'skeleton':'card-content'}>
                <span >{!loading?stats.courseCount:''}</span>
                </div>
              </div>
              <div className='dashboard-card'>
                  <div className='card-head'>
                    <h2><BsGraphUpArrow className='adminIcons'/> Total Revenue </h2>
                  </div>
                  <div className={loading?'skeleton':'card-content'}>
                <span >
                  {!loading?'₹'+stats.totalRevenue?.toLocaleString('en-IN')+'.00':''}
                </span>
              </div>
              </div>
              </div>
          </div>
            <div className={!loading?'pie':'pie-skeleton'}>
              <h3 className='text-center'>Users</h3>
              {!loading&&<Doughnut data={userData}/>}
            </div>
         </div>}
      </Layout>
  )
}

export default AdminDashboard
