import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyCourse } from '../../Components/Store/CourseSlice'
import { Link } from 'react-router-dom'

const Orders = () => {
    const dispatch=useDispatch()
    const orders=useSelector((state)=>state.course.MycourseData.data)
    useEffect(()=>{
        dispatch(fetchMyCourse())
    },[])
    
  return (
   <Layout>
        <div className='orders'>
            <h1>Purchases</h1>
            {orders&&orders.length>0?( <div className='order-details'>
                <div className='order-details-row'>
                <div className='row'>
                    <div className='col-md-8'>
                        <h4>Orders</h4>
                    </div>
                    <div className='col'>
                        <h4>Purchase details</h4>
                    </div>
                    </div>
                </div>
                {orders.map(order=>(
                <div className='row mb-2'>
                    <div className='col-md-8'>
                        <div className='card d-flex flex-row align-items-center p-3'style={{}}>
                            <div className='image 'style={{objectFit:'fill'}}>
                            <img src={order.cover}width='70px'height='40px'className='me-3 rounded'alt='thumbnail'></img>
                            </div>
                            <p style={{}}>{order.title}</p>
                        </div>
                    </div>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <Link className='btn btn-secondary' to={`/order-success?payment_id=${order.paymentId}`}>view details</Link>
                    </div>
                </div>))}
            </div>):(
                    <div className='no-Orders'>
                <h4 className='mb-3'>You Dont have any purchases</h4>
                <p className='d-flex '><Link to='/course' className='btn btn-primary'>Browse Courses</Link></p>
                </div>
         )}
        </div>
    </Layout>
  )
}

export default Orders
