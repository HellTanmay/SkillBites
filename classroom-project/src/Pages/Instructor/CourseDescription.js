import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { useParams,useNavigate } from "react-router-dom";
import {useDispatch,useSelector}from 'react-redux';
import { fetchUser} from '../../Components/Store/UserSlice'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { PiStudent } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { fetchContents } from "../../Components/Store/CourseSlice";
import { RiFileVideoLine, RiListCheck3 } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";


const CourseDescription = () => {
  const [courseInfo, setCourseInfo] = useState(null);
  const { id } = useParams();
  const dispatch=useDispatch()
  const state=useSelector((state)=>state)
  const User=state.User.userData
  const courseContent=state.course.courseContents.data
  const loading=state.course.loading
const navigate=useNavigate()

useEffect(()=>{
  dispatch(fetchUser())
  dispatch(fetchContents(id))
},[dispatch])

  useEffect(() => {
   fetch(`http://localhost:4000/course/${id}`,
    {credentials:'include'}
   ).then((response) => {
      response.json().then((course) => {
        setCourseInfo(course);
      }); 
    });

  }, []);


     if (!courseInfo) return "";
      if (!User)return ""
  const currency='INR';
  const amount=courseInfo.price

  async function payHandler(e){
    try{
    const response=await fetch(`http://localhost:4000/order/${courseInfo._id}`,{
      method:'POST',
      credentials:'include',
      body:JSON.stringify({
        amount:amount*100,
        currency,
      }),
      headers:{
        "Content-Type":"application/json",
      },
    })
    const order=await response.json();
    console.log(order)
    if (response.status>=400 &&response.status<500) {
      toast.info(order.message,{theme:'colored',position:'bottom-right'}); 
      return;
    }
    if (response.status>=500) {
      toast.error(order.message,{theme:'colored',position:'top-center'}); 
      return;
    }
const options = {
  key: 'rzp_test_0bzBSxkt9xLCn4', 
  amount:order.amount,
  currency:order.currency,
  name: courseInfo.title, 
  description: courseInfo.summary,
  image:courseInfo.cover,
  order_id: order.id,
  receipt:order.receipt,
  handler: async function (response){
     const body={
      ...response,
     };
     const validate=await fetch(`http://localhost:4000/order/validate/${courseInfo._id}`,{
      method:'POST',
      body:JSON.stringify(body),
      credentials:'include',
      headers:{
        'Content-Type':'application/json'
      }
     });
     const res=await validate.json();
     console.log(res);
     if(res.success){
      navigate(`/order-success?payment_id=${res.payment_id}`)
     }
  },
  prefill: { 
      name: User.username, 
      email: User.email, 
      contact: User.phone
  },
  theme: {
      color:"#001638"
  }
};
const rzp1 = new window.Razorpay(options);
rzp1.on('payment.failed', function (response){
   toast.error('Try again later')
   console.log(response)
});
rzp1.open();
    
 }catch(err){
  console.log(err)
 }
}

const userExist=courseInfo?.enrolled?.find((user)=>user.student===User._id)


  return (
    <Layout>
      <div className="course-description">
      <div className="desc-heading">
        <h1>{courseInfo.title}</h1>
        <hr/>
          <h6 style={{fontSize:''}}>{courseInfo.summary}</h6>
          <div className="instructor-img">
          <img src={courseInfo.author.photo} className="profile-pic" width='40px'height='40px'/>
          <span>{courseInfo.author.username}</span>
          </div>
          <div className="desc-footer">
          <p><IoTimerOutline/> Duration: {courseInfo.duration} months</p>
          <p> <PiStudent/> Students enrolled: {courseInfo.enrolled.length} </p>
          </div>
      </div>
      <article className="content-description">
          <p dangerouslySetInnerHTML={{ __html: courseInfo.content }} ></p>
          </article>
          <div className="course-contents">
          <div className="text-center bg-secondary"style={{borderRadius:'10px 10px 0 0'}}>
          <h1>Contents</h1>
          </div> 
        <div className="lectures">
           
           {!loading?(
            courseContent.length>0?(
            courseContent?.map((contents) => {
        const duration =Math.floor( contents?.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return (
          <>
         
       
          <div className="lecture-content" >
                <p>{contents.type==='lecture'?<RiFileVideoLine style={{color:'red'}}/> 
                  :contents.type==='assignment'?<FaRegFileAlt style={{color:'green'}}/>
                  :<RiListCheck3 style={{color:'grey'}}/>}
               {' '} {contents?.title }</p>
                <p>
                    {contents?.type === 'lecture' 
                        ? `${minutes}:${seconds.toString().padStart(2, '0')} ` 
                        : contents?.type === 'quiz' 
                            ? `${contents?.length} questions` 
                            : '1 question'}
                </p>
                </div> 
                </>
        );
      
            })):(<div className="d-flex justify-content-center align-items-center "style={{height:'20em'}}>
            No Contents yet
          </div>)):(
              <div className="d-flex justify-content-center align-items-center "style={{height:'20em'}}>
                please wait...
              </div>)}
                  
                    
            </div>
            
            </div>
          <div className="buy-card">
              <img src={courseInfo.cover}width='100%'></img>
              <h1>{courseInfo.title}</h1>
              <div className="d-flex justify-content-between">
              <p className="fs-4"><strong>₹ {courseInfo.price?.toLocaleString('en-IN')}</strong></p>
              <button className="btn btn-primary"
              onClick={()=>User.role==='Admin'||User.username===courseInfo.author.username||userExist?navigate(`/myCourse/view/${courseInfo._id}`):payHandler()}>
              <strong>{User.role==='Admin'||User.username===courseInfo.author.username||userExist?'Watch':'Buy now'}</strong></button>
              </div>
          </div>
</div>
    </Layout>
  );
};


export default CourseDescription;
