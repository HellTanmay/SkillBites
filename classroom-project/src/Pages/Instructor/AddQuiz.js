import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DisplayQuizz, addQuiz } from '../../Components/Store/QuizzSlice';
import { toast } from 'react-toastify';
import { MdDownload } from "react-icons/md";

const AddQuiz = ({closeModal}) => {
    const [excel, setExcel] = useState();
    const [title,setTitle]=useState();
    const [marks,setMarks]=useState();
    const [duration,setDuration]=useState();
console.log(marks)
console.log(duration);
    const {id}=useParams()
    const dispatch=useDispatch()
    const data = new FormData();

    async function add(e){ 
        data.set("excel", excel);
        data.set("title",title);
        data.set("duration",duration);
        data.set("marks",marks);
        e.preventDefault()
        if(!excel||!title||!marks||!duration){
          return toast.error('Every field is mandatory')
         }
     try{
        const res=await dispatch(addQuiz({c_id:id,formData:data}))
         if(res?.payload?.success){
            toast.success(res?.payload?.message)
            await dispatch(DisplayQuizz(id))
            closeModal(false)
         }
         else{
          toast.error(res?.payload?.message)
         }
        }
      catch(err){
        console.log(err)
      }
      }
  return (
    <div className="modal1" style={{ position: "fixed" }}>
     
    <div className="modalcontainer">

      <button
        className="btn rounded-pill btn-danger"
        style={{ float: "right", marginRight: "13px", marginTop: "10px" }}
        onClick={() => closeModal(false)}
      >
        X
      </button>
      <div
        className="modal-title "
        style={{ padding: "10px", background: "white", borderRadius: "20px" }}
      >
        <h1 style={{ marginLeft: "100px", fontFamily: "angkor" }}>
        Add Tests
        </h1>
      </div>
      <form onSubmit={add}>
      <div className="modal-body">
      
        <div className="row mb-4">
          <div className="col-sm-2">
            <label for="formFile"> Excel file</label>
          </div>
          <div className="col-sm-6">
            <input
              type="file"
              className="edit-text form-control"
              id="inputGroupFile04"
              accept=".xlsx, .xls"
              name="excel"
              required
              onChange={(e)=>setExcel(e.target.files[0])}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-sm-2 ">
            <label for="name">Excel format</label>{" "}
          </div>
          <div className="col-sm-6">
            <div className='excel-download'>
            <a className='' href='/Assets/ExcelFormat.xlsx'download><MdDownload className='excel-btn'/>download</a>
            </div>
            <br />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-sm-2 ">
            <label for="name">Title</label>{" "}
          </div>
          <div className="col-sm-6">
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
          <div className="col-sm-4">
            <label>Marks for each question</label>{" "}
          </div>
          <div className="col-sm-5">
          <select name='duration' 
          className='edit-text'
          style={{width:'100%'}}
          value={marks} 
          onChange={(e)=>setMarks(e.target.value)}
          >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              </select>
          </div>
        </div> 
        <div className="row mb-4">
          <div className="col-sm-4">
            <label>Duration(in minutes)</label>{" "}
          </div>
          <div className="col-sm-5">
            <select name='duration' 
            className='edit-text'
            style={{width:'100%'}}
            value={duration} 
            onChange={(e)=>setDuration(e.target.value)}>
              <option value='1'>1</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='30'>30</option>
              <option value='60'>60</option>
            </select>    
          </div>
        </div> 
        
      </div>
      <div className='modal-footer'>
      <button className='btn btn-md btn-info'>Add Test</button>
    </div>
    </form>
   </div>
   
  </div>
  )
}

export default AddQuiz
