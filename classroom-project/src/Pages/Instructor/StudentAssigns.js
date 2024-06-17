import React, { useEffect } from 'react'
import {useDispatch,useSelector}from 'react-redux'
import { UpdateSubmission, getSubmission } from '../../Components/Store/SubmitSlice';
import {Link,useLocation} from 'react-router-dom'
import { fetchAssignments } from '../../Components/Store/AssignmentSlice';
import TableSkeleton from '../../Extras/TableSkeleton';
import toast from 'react-hot-toast';

const StudentAssigns = ({format,c_id,q_id}) => {
  let count=0;
    const location=useLocation()
    const dispatch=useDispatch()
    const submissions=useSelector((state)=>state?.Submissions?.submissions?.data)
    const isLoading=useSelector((state)=>state?.Submissions?.isLoading)

     async function click(submit,checked){
        const res=await dispatch(UpdateSubmission({sub_id:submit._id,status:checked,c_id,q_id}))
        if(res?.payload?.success){
          dispatch(fetchAssignments(c_id))
          toast.success('Marked',{position:'bottom-right'})
        }
    }
    useEffect(()=>{
        dispatch(getSubmission({c_id,q_id}))
    },[c_id,q_id])

    const isPdfViewerPage = location.pathname === '/file-viewer';
  return(<>
     {!isPdfViewerPage &&(
     <table class="table table-bordered table-striped">
  <thead className="thead-dark">
    <tr>
      <th scope="col">SL.No</th>
      <th scope="col">Student Name</th>
      <th scope="col"style={{width:'400px'}}>Answers</th>
      <th scope="col">Files</th>
      <th scope="col">Submitted on</th>
      <th scope="col">mark as submitted</th>
    </tr>
  </thead>
  {!isLoading ?( 
  submissions?.length!==0?(
   <tbody>
  {submissions?.map(submit=>(<>
    <tr key={submit._id}>
        <th scope="row">{count=count+1}</th>
        <td>{submit.student.username}</td>
      <td>{submit.description}</td>
      <td>{submit.file?(<Link className='btn btn-success' to={`/file-viewer?source=${submit.file}`}>View</Link>):'No file'}</td>
      <td>{format(submit.submittedAt).date +' at '+format(submit.submittedAt).time}</td>
      <td style={{ textAlign:'center'}}><input type='checkbox'checked={submit?.status==='submitted'}
      onChange={(e)=>click(submit,e.target.checked)}/></td>   
    </tr>
    </>  
     ))} 
    </tbody>):(
    <tbody>
    <tr>
      <td colspan='6'className='text-center text-danger'>No Submissions yet</td>
    </tr>
    </tbody>)):(
      <TableSkeleton columns={6}/>
    )}
    
    </table>)}
  

  </>
  )
}


export default StudentAssigns
