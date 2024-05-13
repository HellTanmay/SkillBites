import React, { useEffect } from 'react'
import {useDispatch,useSelector}from 'react-redux'
import { UpdateSubmission, getSubmission } from '../../Components/Store/SubmitSlice';
import {Link,useLocation} from 'react-router-dom'

const StudentAssigns = ({format,c_id,q_id}) => {
  let count=0;
    const location=useLocation()
    const dispatch=useDispatch()
    const submissions=useSelector((state)=>state?.Submissions?.submissions?.data)
    const isLoading=useSelector((state)=>state?.Submissions?.isLoading)

     function click(submit,checked){
        dispatch(UpdateSubmission({sub_id:submit._id,status:checked,c_id,q_id}))
    }
    useEffect(()=>{
        dispatch(getSubmission({c_id,q_id}))
    },[c_id,q_id])

    const isPdfViewerPage = location.pathname === '/file-viewer';
  return(<>
 {isLoading&&(<> <div className="loader">
    <div className="spinner-border"
            style={{ position: "fixed", left: "50%", top: "50%" }}role="status">
        <span className="sr-only">Loading...</span>
        </div>
     </div></>)}
     {!isLoading && !isPdfViewerPage &&(
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
  {submissions?.length!==0? <tbody>
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
    </tbody>:
    <tbody>
    <tr>
      <td colspan='6'className='text-center text-danger'>No Submissions yet</td>
    </tr>
    </tbody>}
    
    </table>)}
  

  </>
  )
}


export default StudentAssigns
