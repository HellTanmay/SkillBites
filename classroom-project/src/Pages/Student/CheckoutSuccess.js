import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { getPayment } from '../../Components/Store/PaymentSlice'

const CheckoutSuccess = () => {
  const dispatch=useDispatch()
  const payment=useSelector((state)=>state.Payments.payments.data)
  const loading=useSelector((state)=>state.Payments.isLoading)
  const params = new URLSearchParams(window.location.search);
const payment_id=params.get('payment_id')
  useEffect(()=>{
    dispatch(getPayment(payment_id))
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
    <Layout>
    <div className='checkout'>
      {loading&&<div className='d-flex justify-content-center'>
        <div className='loading-animation'>Wait a moment...</div>
        </div>}
    {payment&&!loading&&<div className='checkout-details'>
      <div className='checkout-heading'>
      <img src='/Assets/Logo2.png'width='50px' height='40px'alt='skillBites'></img>
        <h1>Skill Bites</h1>
        </div>
        <div className='sub'>
          {payment?.map(pay=>(<>
        <p style={{float:'right'}}>OrderID:<strong> {pay.orders.order_id}</strong></p>
        <p>Payment_id: <strong>{pay.orders.id}</strong></p>
        <div className='sub1'>
        <p>Name: <strong>{pay?.courses[0]?.userId?.username}</strong></p>  
        <p>Mobile no:<strong> {pay.orders.contact}</strong></p>
        <p>Email:<strong> {pay.orders.email}</strong></p>
        <p>Method:<strong> {pay.orders.method}</strong></p>
        <p>Date of purchase: <strong> {format(pay.orders.created_at*1000)}</strong></p>
        </div>
        <table className='table'>
            <thead className='table-dark'>
            <tr>
              <th>#</th>
                <th>Product</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody className='table-secondary'>
            <tr>
              <td>1</td>
                <td>{pay.courses[0].courseId.title}</td>
                <td>{pay.orders.amount/100}/-</td>
            </tr>
            <tr>
            <th colSpan='2'style={{textAlign:'right'}}> Grand Total:</th>
            <th> {pay.orders.amount/100}/-</th>
            </tr>
            </tbody>
        </table>
           <p className='thanks text-center'>Thank You For The Purchase</p>
           </>
))}
      </div>
      </div>}
    </div>
    </Layout>
  )
}

export default CheckoutSuccess
