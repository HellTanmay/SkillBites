import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPayments } from '../../Components/Store/PaymentSlice'
import { toast } from 'react-hot-toast'
import TableSkeleton from '../../Extras/TableSkeleton'

const AdminPayment = () => {
  const [payment,setPayment]=useState()
    const dispatch=useDispatch()
    const payments=useSelector((state)=>state?.Payments?.payments?.data)
    const isLoading=useSelector((state)=>state?.Payments?.isLoading)

    useEffect(()=>{
        dispatch(getAllPayments())
    },[dispatch])

    const handleSubmit = async(e) => {
      try{
      e.preventDefault(); 
      if(payment){
        await dispatch(getAllPayments(payment));
      }
      else{
      await dispatch(getAllPayments())
      }
    }catch(err){
     toast.error('Something went wrong')
    }
    };
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
   
          <div className='Payment-Dashboard'>
        <h1 className='text-center'> Payments</h1>
       <input type='text'value={payment} placeholder='Enter Payment_id'onChange={(e)=>setPayment(e.target.value)}/>
        <button onClick={handleSubmit}>Filter</button>
        <div className='bars'style={{overflow:'auto',maxHeight:'80vh'}}>
     <table className="table  table-light table-hover table-striped">
  <thead className='table-dark fixed-header'>
    <tr>
      <th scope="col">Payment_id</th>
      <th scope="col">Username</th>
      <th scope="col">Email</th>
      <th scope="col">Course Purchased</th>
      <th scope="col">Amount</th>
      <th scope="col"><span>Status</span></th>
      <th scope="col">Purchased on</th>   
    </tr>
  </thead>
  {!isLoading?(
  payments?(<tbody>
    {payments?.map(payment=>(
    <tr key={payment?.orders?.id} >
      <th scope="row">{payment?.orders.id}</th>
      <td>{payment?.courses[0]?.userId?.username}</td>
      <td>{payment?.orders?.email}</td>
      <td>{payment?.courses[0]?.courseId?.title}</td>
      <td>{payment?.orders?.amount/100+'.00'}</td>
      <td><span className={payment?.orders?.status==='captured'?'badge bg-success':'badge bg-danger'}>{payment?.orders?.status}</span></td>
      <td>{format(new Date(payment?.orders?.created_at*1000)).date  +' at '+format(new Date(payment?.orders?.created_at*1000)).time}</td>
    
    </tr>))}
  </tbody>):( <tbody>
            <tr>
              <td colSpan="7" className="text-center">No Payments available</td>
            </tr>
          </tbody>)):(
            <TableSkeleton columns={7} rows={payments?.length}/>
          )}
</table>
</div>
</div> 
    </Layout>
  )
}

export default AdminPayment
