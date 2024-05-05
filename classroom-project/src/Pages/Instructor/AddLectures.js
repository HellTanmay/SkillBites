import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useDispatch,useSelector} from 'react-redux';
import { addLecture, getLectures } from "../../Components/Store/RecordSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddLectures = ({ closeModal }) => {
  const [video, setVideo] = useState();
  const [title,setTitle]=useState();
  const [desc,setDesc]=useState();

  const {id}=useParams()
  const loading=useSelector((state)=>state?.Lecture?.loading)
  const dispatch=useDispatch()
  const data = new FormData();

   async function add(e){ 
      data.set("video", video);
      data.set("title",title);
      data.set("description",desc);
      e.preventDefault()
      if(!video||!title||!desc){
        return toast.error('Every field is mandatory')
       }
   try{
      const res=await dispatch(addLecture({c_id:id,formData:data}))
       if(res?.payload?.success){
          toast.success(res?.payload?.message)
          await dispatch(getLectures(id))
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
  
  return (<>
  
    <div className="modal1" style={{ position: "fixed" }}>
     
      <div className="modalcontainer">
      {loading && (
      <div className="loader"style={{zIndex:'2'}}>
        <div className="spinner-border"
          style={{ position: "fixed", left: "50%", top: "50%" }}
          role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )}
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
            Add a new Lecture
          </h1>
        </div>
        <form onSubmit={add}>
        <div className="modal-body">
        
          <div className="row mb-4">
            <div className="col-sm-2">
              <label for="formFile"> Video</label>
            </div>
            <div className="col-sm-6">
              <input
                type="file"
                className="edit-text form-control"
                id="inputGroupFile04"
                accept="video/*"
                name="video"
                required
                onChange={(e)=>setVideo(e.target.files[0])}
              />
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
            <div className="col-sm-2">
              <label >Description</label>{" "}
            </div>
            <div className="col-sm-9">
           <ReactQuill
              placeholder="provide description,links"
              style={{ background: "white", }}
              onvalue={desc}
              id="desc"
              onChange={(newValue) => setDesc(newValue)}
            />
            </div>
          </div> 
        </div>
        <div className='modal-footer'>
        <button className='btn btn-md btn-info'>Add Lecture</button>
      </div>
      </form>
     </div>
     
    </div>
    </>
  );
};

export default AddLectures;
