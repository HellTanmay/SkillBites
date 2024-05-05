import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, fetchMyCourse } from "../Components/Store/CourseSlice";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useEffect } from "react";
import { fetchUser } from "../Components/Store/UserSlice";


export default function Course({title,summary,cover,price,author,_id,approved,source}){

    const dispatch=useDispatch()
    const role=useSelector((state)=>state.User.userData.role)

    async function handleDelete(courseId){
        if(window.confirm('Do u really want to delete this course')){
          const res= await dispatch(deleteCourse(courseId))
        console.log(res)
        if(res?.payload?.success){
          dispatch(fetchMyCourse())
          toast.success(res?.payload?.message,{position:'top-center'})
        }
      }
      }
      useEffect(()=>{
         dispatch(fetchUser())
      },[])
    const link = source === 'myCourse' ? `/myCourse/view/${_id}` : `/course/${_id}`;
    return(
        <>
        <div className="course-card card">
              <div className="image" style={{width:'320px',height:'210px',borderBottom:'2px solid',marginLeft:'-13px',marginTop:'-5px',overflow:'hidden',position:'relative',borderRadius:'5px 5px 0 0'}}>
  <img src={cover} className="card-img-top" alt="img" style={{width:'320px',height:'210px',objectFit:'cover'}}/>
  </div>
  <div className="card-body">
    <h4 className="card-title fw-bold "style={{fontFamily:"Teko", fontStyle:"normal",fontWeight:"400",}}>{title}</h4>
    <div className="d-flex flex-row justify-content-between">
    <span className="" style={{fontSize:"12px", color:"grey", marginLeft:"0", marginTop:""}}><FaUserGraduate/> {author.username}</span>
   {source==='myCourse'&&role==="Instructor"&&(
     <span style={{color:'red',cursor:'pointer',float:'right'}}><RiDeleteBin2Line onClick={()=>handleDelete(_id)}/></span>)}
    </div>
    <hr />
   {source==='myCourse'&&!approved?(
   <div className="d-flex flex-column justify-content-center"style={{alignItems:'center'}}>
   <img src="/Assets/pending.gif" width='40px'alt='pending'></img>
   <p>Waiting for approval...</p>
   </div>
   ):(
    <div className='card-text'>
    <p>{summary}</p>
    <hr/>
    </div>
   )}
      
    <span className="course-price d-flex "style={{marginTop:'auto'}}>
        
    <p className=" "style={{fontFamily:'Teko', fontSize:"25px",fontWeight:"bold",marginTop:'4px'}}>₹{price?.toLocaleString('en-IN')} </p>
   <Link to={link} className="btn btn-primary"style={{width:"110px", height:"40px",marginTop:'5px'}}>{source==='myCourse'?'Watch':'Explore'}</Link>
    </span>
    
 </div>
</div>
    </>
);
       
}