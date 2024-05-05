import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContact } from '../../Components/Store/ExtraSlice'

const Feedbacks = () => {
    const dispatch=useDispatch()
    const contact=useSelector((state)=>state.Extras.contact.data)
    useEffect(()=>{
        dispatch(fetchContact())
    },[])
    let count=0

    function format(formatted){
      const date=new Date(formatted)
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }

  return (
   <Layout hideFooter={true}initial={true}>
        <div className='Course-Dashboard'>
        <h1 className='text-center'>Feedbacks</h1>
      <table className="table table-light table-striped">
  <thead className='table-dark'>
    <tr>
      <th scope="col">SL_NO</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Sent on</th>
      <th scope="col">Message</th>   
    </tr>
  </thead>
  <tbody>
    {contact&&contact.map(contacts=>(
    <tr key={contacts._id}>
      <th scope="row">{count=count+1}</th>
      <td>{contacts.name}</td>
      <td>{contacts.email}</td>
      <td>{format(contacts?.createdAt)}</td>
      <td style={{width:'40%'}}>{contacts.message}</td> 
    </tr>))}
  </tbody>
</table>
</div> 
   </Layout>
  )
}

export default Feedbacks
