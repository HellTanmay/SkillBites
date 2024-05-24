import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { addAssignments } from '../../Components/Store/AssignSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiCloseFill } from 'react-icons/ri';


const AddAssignment = ({closeModal}) => {
    const [pdf,setPdf]=useState();
    const [title,setTitle]=useState();
    const [desc,setDesc]=useState();
    const [marks,setMarks]=useState();
    
    const {id}=useParams()
    const dispatch=useDispatch();
    const data=new FormData()

    async function add(e){
      
      data.append('title',title)
      data.append('description',desc)
      data.append('marks',marks)
      data.append('pdf',pdf)
      e.preventDefault();
      try{
          const res=await dispatch(addAssignments({c_id:id,formData:data}))
          if(res?.payload?.success){
           toast.success("Assignment Added")
            closeModal(false)
          }
          else{
            toast.error(res.payload.message)
          }
      }catch(err){
        console.log(err)
      }
    }

  return (
    <div className="modal1">
    <div className="modalcontainer">
   
      <div className="modal-title">
        <h1 style={{ marginLeft: "10px", fontFamily: "angkor" }}>
          Add a new Assignment
        </h1>
        <button onClick={()=>closeModal(false)}><RiCloseFill style={{marginBottom:'20px',marginLeft:'-3px'}}/></button>
      </div>
      <form onSubmit={add}>
      <div className="modal-body">
      
        <div className="row mb-4">
          <div className="col-sm-2 ">
            <label for="name">Question</label>{" "}
          </div>
          <div className="col-sm-10">
            <input
              type="text"
              className="edit-text"
              name="title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              id="name"
              required
            ></input>
            <br />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-sm-2">
            <label >Description</label>{" "}
          </div>
          <div className="col-sm-10">
         <textarea className="edit-text"style={{height:'100px'}}
         required
         name='description'
         value={desc} 
         onChange={(e)=>setDesc(e.target.value)}/>
          </div>
        </div> 
        <div className="row mb-4">
          <div className="col-sm-2">
            <label >Marks</label>{" "}
          </div>
          <div className="col-sm-10">
         <input type='number' className="edit-text"style={{}}
         required
         name='description'
         value={marks} 
         onChange={(e)=>setMarks(e.target.value)}/>
          </div>
        </div> 
        <div className="row mb-4">
          <div className="col-sm-2">
            <label for="formFile"> File</label>
          </div>
          <div className="col-sm-10">
            <input
              type="file"
              className="edit-text form-control"
              id="inputGroupFile04"
              accept="application/pdf"
              onChange={(e)=>setPdf(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div className='modal-footer'>
      <button className='btn btn-md btn-info text-white'>Add Assignment</button>
    </div>
    </form>
   </div>
   
  </div>
  )
}

export default AddAssignment
