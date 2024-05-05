import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { useParams,useNavigate } from "react-router-dom";
import {useDispatch,useSelector}from 'react-redux';
import { fetchUser} from '../../Components/Store/UserSlice'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const CourseDescription = () => {
  const [courseInfo, setCourseInfo] = useState(null);
  const { id } = useParams();
  const dispatch=useDispatch()
  const User=useSelector((state)=>state.User.userData)
const navigate=useNavigate()

useEffect(()=>{
  dispatch(fetchUser())
},[])

  useEffect(() => {
   fetch(`http://localhost:4000/course/${id}`).then((response) => {
      response.json().then((course) => {
        setCourseInfo(course);
      }); 
    });

  }, []);
     if (!courseInfo) return "";
      if (!User)return ";"
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
      toast.error(order.message,{theme:'colored',position:'bottom-center'}); 
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
    //e.preventDefault();
 }catch(err){
  console.log(err)
 }
}

  return (
    <Layout>
      <div className="desc">
      <div className='head'>
    <h2>{courseInfo.title}</h2>
    <p style={{marginLeft:"20px"}}> {courseInfo.summary}</p>
  </div>
    <div className='desc-container'>
 
  <div className='content' style={{  }}>
      <img src={courseInfo.cover} width="400px" height="" alt='' style={{borderRadius:'5px',border:'2px solid grey'}}/>
    <div className='details'>
      <p style={{fontWeight:'bold'}}><span className="detail">Created by:</span> {courseInfo.author.username}</p>
      <p style={{fontWeight:'bold'}}> <span className="detail">Duration:</span> {courseInfo.duration} months</p>
      <p style={{fontWeight:'bold', color: "blue" }}> <span className="detail">Price: </span>
      <strong>₹{courseInfo.price?.toLocaleString('en-IN')}</strong></p>
     
        <button className='btn btn-md bg-primary text-white'
        onClick={()=>User.role==='Admin'||User.username===courseInfo.author.username?navigate(`/myCourse/view/${courseInfo._id}`):payHandler()} style={{width:'200px',marginTop:'50px'}}>
          <strong>{User.role==='Admin'||User.username===courseInfo.author.username?'Watch':'Buy now'}</strong></button>
    </div>
  </div>
 
  <h2 style={{margin:"10px auto"}}>About Course</h2>
  <div className='content-description' dangerouslySetInnerHTML={{ __html: courseInfo.content }} />

 {(User.role!=='Admin'||User.username!==courseInfo.author.username)&&(
 <button className='btn btn-md bg-primary text-white'onClick={payHandler}style={{width:'500px', marginBottom:"10px",margin:'0 auto'}}><strong>Buy Now</strong></button>)}

</div>
</div>
    </Layout>
  );
};

export default CourseDescription;
