import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { UserContext } from "../../UserContext";
import { Link, useParams } from "react-router-dom";
import {IoIosArrowDown,IoIosArrowUp,IoIosAddCircleOutline} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLectures, updateLecture } from "../../Components/Store/RecordSlice";
import AddAssignment from "../Instructor/AddAssignment";
import { deleteAssign, submitAssign } from "../../Components/Store/AssignSlice";
import Performance from "./Performance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentAssigns from "../Instructor/StudentAssigns";
import { FaCheck } from "react-icons/fa";
import AddLectures from "../Instructor/AddLectures";
import './viewCourse.css';
import { RiDeleteBin4Line } from "react-icons/ri";
import {DisplayQuizz, deleteQuizz} from "../../Components/Store/QuizzSlice";
import DisplayQuiz from './DisplayQuiz'
import AddQuiz from "../Instructor/AddQuiz";

function ViewCourse() {
  const [videoSrc, setVideoSrc] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [openModal, setOpenmodal] = useState(false);
  const [lectureModal, setLectureModal] = useState(false);
  const [openTestModal, setTestModal] = useState(false);
  const [assignments, setAssignments] = useState(null);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [desc, setDesc] = useState("");
  const [quizState,setQuizState]=useState()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const videoRef=useRef(null)
  const fileInputRef = useRef("");

  const dispatch = useDispatch();
  const lectures = useSelector((state) => state?.Lecture?.lectures?.data);
  const quizzes=useSelector((state)=>state.Quizzes.quizzes.data)

  const params = new URLSearchParams(window.location.search);
  const q_id = params.get("assignment_id");
  const qu_id=params.get("quizz_id")
  const l_id=params.get("lecture_id")
  const { id } = useParams();

  const { userInfo } = useContext(UserContext);
  const role = userInfo?.role;
  const user = userInfo?.id;


function fetchAssignments(){
  try {
    fetch(`http://localhost:4000/getAssignments/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((data) => setAssignments(data.data));
    });
  } catch (err) {
    console.log(err);
  }
}

  useEffect(() => {
    fetchAssignments()
  }, [openModal]);

  useEffect(() => {
    dispatch(getLectures(id));
    dispatch(DisplayQuizz(id));
  }, [dispatch]);
 
  function format(formatted) {
    const date = new Date(formatted);
    const dateType = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeType = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateType, time: timeType };
  }

  function handleClick(lecture) {
    setVideoSrc(lecture.file.secure_url);
    setSelectedLecture(lecture);
    setSelectedAssign(null);
    setSelectedQuiz(null)
    params.set("lecture_id", lecture._id);
    params.delete("assignment_id");
    params.delete('quizz_id')
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  function clear(e) {
    setDesc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAssign(assignment) {
    setSelectedAssign(assignment);
    setSelectedLecture(null);
    setSelectedQuiz(null)
    clear();
    params.delete("lecture_id");
    params.delete('quizz_id')
    params.set("assignment_id", assignment._id);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  function handleQuizzes(quizz) {
    setSelectedQuiz(quizz);
    setSelectedAssign(null);
    setSelectedLecture(null);
    params.set("quizz_id", quizz._id);
    params.delete("assignment_id");
    params.delete("lecture_id");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

//Automatic mounting while reloading
  useEffect(() => {
    if (q_id) {
      const selectedAssignment =assignments &&
          assignments.find((assignment) => assignment._id === q_id);
      if (selectedAssignment) {
        setSelectedAssign(selectedAssignment);
      }
    }
    if (qu_id) {
      const selectQuiz =quizzes &&
          quizzes.find((quiz) => quiz._id === qu_id);
      if (selectQuiz) {
        setSelectedQuiz(selectQuiz)
      }
    }
    if (l_id) {
      const selectLec =lectures &&
          lectures.find((lecture) => lecture._id === l_id);
      if (selectLec) {
        setSelectedLecture(selectLec)
        setVideoSrc(selectLec.file.secure_url)
        console.log("145",selectLec)
      }
    }
  }, [q_id, assignments,qu_id, quizzes,l_id,lectures]);

  async function submit(e) {
    e.preventDefault();
    if (!desc && !fileInputRef.current.files.length) {
      toast.error('Please type your answer or attach a file',{position:'bottom-center'});
      return;
    }
    const data = new FormData();
    data.append("description", desc);
    data.append("submit", fileInputRef.current.files[0]);
    try {
      const res = await dispatch(
        submitAssign({ c_id: id, q_id, formData: data })
      );
      if (res.payload.success) {
        toast.success(res.payload.data);
        fetchAssignments()
        clear();
      } else {
        toast.error(res.payload.message);
      }
    } catch (err) {
      toast.error(err);
    }
  }

  async function handleLecDelete(l_id){
  if(window.confirm('Do u really wish to delete this lecture')){
    const res=await dispatch(deleteLecture({courseId:id,lectureId:l_id}))
    if(res.payload.success){
      toast.success(res.payload.data,{position:'top-center'})
      dispatch(getLectures(id))
    }
  }
  }
  async function handleAssignDelete(a_id){
    if(window.confirm('Do u really wish to delete this Assignment')){
    const res=await dispatch(deleteAssign({courseId:id,assignId:a_id}))
    if(res.payload.success){
      toast.success(res.payload.data,{position:'top-center'})
      fetchAssignments()
    }
  }
  }

  async function handleMarked(l_id){
    const res=await dispatch(updateLecture({courseId:id,lectureId:l_id}))
    if(res.payload.success){
      toast.info('Progress updated')
      dispatch(getLectures(id))
    }
  }
async function handleQuizDelete(qui_id){
  if(window.confirm('Do u really wish to delete this test')){
    const res=await dispatch(deleteQuizz({c_id:id,quizz_id:qui_id}))
    console.log(res)
    if(res?.payload?.success){
      toast.success(res?.payload?.data,{position:'top-center'})
      dispatch(DisplayQuizz(id))
    }
  }
}

// const isFullyBuffered = () => {
//   const video = videoRef?.current;
//   const buffered = video?.buffered;
//   if (buffered?.length) {
//     const end = buffered?.end(buffered?.length - 1);
//     return end >= video?.duration;
//   }
//   return false;
// };
// useEffect(() => {
//   const video = videoRef.current;
//   video?.addEventListener('progress',()=>{
//    if( video?.ended){
//     console.log('wow')
//    }
//   })
// },[])
 

const handleTimeUpdate = () => {
  const video = videoRef.current;
  if (video.currentTime === video.duration) {
    handleMarked(l_id)
  }
};
 

const marked=selectedLecture?.watched?.includes(user)
  const pdfUrl = selectedAssign && selectedAssign.file;
  const sub =selectedAssign &&selectedAssign.submit &&
    selectedAssign.submit.find((sub) => sub.student === user);

  return (
    <Layout hideFooter={true} index={false}>
      <div className="view-container">
       <div className={"sidebar"}>
          <div className=""style={{overflowY:'scroll',overflowX:'hidden'}}>
            <div className="sidebar-heading h-auto">
              <h1 className="text-center "
                style={{width: "335px",}}>
                Videos
                {role === "Instructor" && (
                  <IoIosAddCircleOutline className="addIcon" onClick={() => setLectureModal(true)}/>
                )}
              </h1>
            </div>
            <div className="span-files bars">
             
            {lectures?.length!==0 ?lectures?.map((lecture) => (
                  <>
                    <li className={`file ${selectedLecture === lecture ? "active" : ""}`}
                        key={lecture._id}
                        style={{cursor:quizState==='Quizz'?'not-allowed':'pointer'}}
                        onClick={quizState!=='Quizz'?()=> handleClick(lecture):null}>
                        <p style={{ fontWeight: "bold" }}>{lecture.filename}</p>
                        {role==='Instructor'&&(<p onClick={(e)=>e.stopPropagation()}style={{marginTop:'-40px',float:'right',color:'red'}}><RiDeleteBin4Line onClick={()=>handleLecDelete(lecture._id)}/></p>)}
                          <p style={{fontSize: "12px",marginTop: "-15px",color: "#6B6860",}}>
                            {format(lecture.createdAt).date}
                            <span style={{ float: "right", color: "#6B6860" }}>
                            {format(lecture.createdAt).time}
                           </span>
                        </p>
                    </li>           
                  </>
                )):(<div className="d-flex align-items-center justify-content-center" style={{minHeight:'200px'}}>
                  <p>No lectures yet</p>
                 </div>
               )}
          </div>
   
            <div className="sidebar-heading"
              style={{height:'auto',borderTop:'2px solid'}}>
              <h1 className="text-center"
                style={{width: "335px", }}>
                Assignment
                {role === "Instructor" && (
                  <IoIosAddCircleOutline
                    className="addIcon"
                    onClick={()=>setOpenmodal(true)}/>)}
              </h1>
            </div>
        
            <div className="span-files bars" >
              {assignments?.length!==0 ?assignments?.map((assignment) => {
                  const counting = assignment.submit &&assignment.submit.filter(
                      (submission) => submission.status === "pending").length;
                  return (
                    <> 
                      <li className={`file ${selectedAssign === assignment ? "active" : ""}`}
                        style={{cursor:quizState==='Quizz'?'not-allowed':'pointer'}}
                        onClick={quizState!=='Quizz'?() => handleAssign(assignment):null}>
                        <p style={{ fontWeight: "bold" }}>
                          {assignment.title}
                          {role === "Instructor" && (<>
                            <span onClick={(e)=>e.stopPropagation()} style={{float:'right', color:'red'}}><RiDeleteBin4Line onClick={()=>handleAssignDelete(assignment._id)}/></span>
                            <span className="badge rounded-pill bg-danger"style={{float:'right'}}>
                              {counting > 0 && counting}
                            </span>
                            
                            </>
                          )}
                        </p>

                        <p style={{fontSize: "12px", marginTop: "-15px",color: "#6B6860",}}>
                          {format(assignment.createdAt).date}
                          <span style={{ float: "right", color: "#6B6860" }}>
                            {format(assignment.createdAt).time}
                          </span>
                        </p>
                      </li>

                    </>
                  );
                }):<div className="d-flex align-items-center justify-content-center" style={{minHeight:'200px'}}>
                <p>No Assignments yet</p> 
               </div>}
            </div>
            <div className="sidebar-heading"style={{height:'auto'}}>
              <h1 className="text-center"
                style={{width: "335px",borderTop:'2px solid'}}>
                Tests
                {role === "Instructor" && (
                  <IoIosAddCircleOutline className="addIcon" onClick={() => setTestModal(true)}/>
                )}
              </h1>
            </div>
            <div className="span-files bars">
            {quizzes?.length!==0 ?quizzes?.map((quizz) => (
                  <>
                    <li className={`file ${selectedQuiz === quizz ? "active" : ""}`}
                        key={quizz._id}
                        onClick={() => handleQuizzes(quizz)}>
                        <p style={{ fontWeight: "bold" }}>{quizz.title}</p>
                        {role==='Instructor'&&(<p onClick={(e)=>e.stopPropagation()}style={{marginTop:'-40px',float:'right',color:'red'}}><RiDeleteBin4Line onClick={()=>handleQuizDelete(quizz._id)}/></p>)}
                          <p style={{fontSize: "12px",marginTop: "-15px",color: "#6B6860",}}>
                            {format(quizz.createdAt).date}
                            <span style={{ float: "right", color: "#6B6860" }}>
                            {format(quizz.createdAt).time}
                           </span>
                        </p>
                    </li>           
                  </>
                )):(<div className="d-flex align-items-center justify-content-center" style={{minHeight:'200px'}}>
                  <p>No Tests yet</p>
                 </div>
               )}
          </div>
   
            </div>
        </div>
        <div className="view-content d-flex flex-column ">
          {!selectedLecture&&!selectedAssign&&!selectedQuiz&&(
          <div className="performance">
                <Performance id={id}/>
          </div>)}
          {selectedLecture && (
            <>
             {role==='Student'&&( <div className=" d-flex gap-2"style={{justifyContent:'flex-end',marginBottom:'5px',marginRight:'20px'}}>
              <input className="marked" type='checkbox'checked={marked}id="mark"name='mark'
                />
                <label htmlFor="mark">Mark as watched</label>
                </div>)}
              <div className="video-container">
               
                <video src={videoSrc}
                ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                        controls
                        disablePictureInPicture
                        autoPlay
                        controlsList="nodownload"
                        width="100%"
                        height="100%"
                ></video>
              </div>
              
                <div className="accordion">
                  <div className={`accordion-header ${isActive ? "active" : ""}`}
                    onClick={() => setIsActive(!isActive)}>
                    <h2> {selectedLecture ? (
                        selectedLecture?.filename
                      ) : (
                        <span style={{ color: "grey" }}>-</span>
                      )}
                    </h2>
                    
                     <span>{isActive ? ( <IoIosArrowDown className="icon" />  ) :
                     ( <IoIosArrowUp className="icon" />)}
                     </span>
                    
                  </div>
                  {isActive && (
                    <div className={`accordion-content ${isActive ? "active" : ""}`} dangerouslySetInnerHTML={{ __html: selectedLecture?.description.replace(
                      /href="((?!https?:\/\/)[^"]+)"/g,
                        'href="https://$1"'
                        ), }}>
                         
                    </div>
                  )}
                </div>
          
              {/* <div className="dis-container">
          <Discussion/>
          
          </div> */}
            </>
          )}
          {selectedAssign && (
            <div className="assignment-container">
              <div className="assign-heading">
                <h1
                  style={{
                    textTransform: "uppercase",
                    borderBottom: "2px solid",
                  }}>

                  {selectedAssign && selectedAssign.title}
                </h1>
                <span className="q">Question:</span>
                <p style={{ textIndent: "60px", color: "var(--txt-clr)" }}>
                  {selectedAssign && selectedAssign.description}
                </p>
                {pdfUrl && (
                     <Link className='btn btn-success'to={`/file-viewer?source=${pdfUrl}`}>View Question</Link>
                )}
                <span style={{ float: "right", color: "red" }}>
                  marks: {selectedAssign && selectedAssign.marks}
                </span>
              </div>
              {role === "Student" && (
                <div className="submit">
                  <h3 style={{ marginLeft: "10px" }}>
                    {!sub ? "Submit Your answer" : ""}
                  </h3>
                  {sub ? (
                    <div>
                      <h2 style={{ fontWeight: "bold" }}>
                        Answer Successfully Submitted
                        <FaCheck className="check" />
                      </h2>
                      <p>
                        Status:
                        <span
                          className={
                            sub.status === "pending"
                              ? "badge bg-warning"
                              : "badge bg-success"
                          }
                        >
                          {sub.status}
                        </span>
                      </p>
                      {sub.status === "submitted" ? (
                        <p>
                          You have gained<span>{sub.marks}</span> marks
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      <textarea
                        className="textBox"
                        placeholder="Type your answer"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      />
                      <label style={{ marginLeft: "5px" }} htmlFor="formFile">
                        Attach files
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        ref={fileInputRef}
                      />
                      <div className="bt">
                        <button type="submit">Submit</button>
                        <button type="reset" value="reset" onClick={clear}>
                          clear
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {role === "Instructor" && (
                <div className="students">
                  <h3>Assignments</h3>
                  <StudentAssigns format={format} c_id={id} q_id={q_id} />
                </div>
              )}
            </div>
          )}
        {selectedQuiz&&<div className="quiz">
            <DisplayQuiz quizz_id={qu_id} tests={selectedQuiz} states={setQuizState}/>
          </div>}
          
        </div>
        {openTestModal && <AddQuiz closeModal={setTestModal} />}
        {openModal && <AddAssignment closeModal={setOpenmodal} />}
        {lectureModal && <AddLectures closeModal={setLectureModal} />}
      </div>
    </Layout>
  );
}

export default ViewCourse;
