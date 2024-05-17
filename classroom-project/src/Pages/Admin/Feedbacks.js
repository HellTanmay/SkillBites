import React, { useEffect } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContact } from '../../Components/Store/ExtraSlice'
import TableSkeleton from '../../Extras/TableSkeleton'

const Feedbacks = () => {
    const dispatch=useDispatch()
    const contact=useSelector((state)=>state.Extras.contact.data)
    const loading=useSelector((state)=>state.Extras.loading)
    useEffect(()=>{
        dispatch(fetchContact())
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
   <Layout hideFooter>
        <div className='Course-Dashboard'>
        <h1 className='text-center'>Feedbacks</h1>
        <div className='bars'style={{overflow:'auto',maxHeight:'80vh'}}>
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
  {!loading?(
    contact?.length!==0?(
  <tbody>
    {contact?.map((contacts,index)=>(
    <tr key={contacts._id}>
      <th scope="row">{index+1}</th>
      <td>{contacts.name}</td>
      <td>{contacts.email}</td>
      <td>{format(contacts?.createdAt)}</td>
      <td style={{width:'40%'}}>{contacts.message}</td> 
    </tr>))}
  </tbody>):(
    <tbody>
      <tr>
        <td colSpan={5}>No feedbacks yet</td>
      </tr>
    </tbody>)):(
      <TableSkeleton columns={5} rows={contact?.length}/>
  )}
</table>
</div> 
</div>
   </Layout>
  )
}

export default Feedbacks
