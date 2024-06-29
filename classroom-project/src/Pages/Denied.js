import React from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { IoHome } from 'react-icons/io5'
import { RiErrorWarningFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Denied = () => {
    const navigate=useNavigate()
    const goBack=()=>{
      window.history.go(-2)
    }
  return (
    <div className='text-center d-flex flex-column 'style={{width:'700px',margin:'100px auto',padding:'10px'}}>
    <p><RiErrorWarningFill style={{color:'red',fontSize:'80pt'}}/></p>
  
    <h1 style={{fontSize:'80pt',fontFamily:'roboto',color:'red'}}>403</h1>
    <h3 style={{color:'red'}}>Access Denied!</h3>
    <div style={{justifyContent:'space-around',display:'flex',marginTop:'20px'}}>
   <span className='btn bg-primary bg-gradient text-white'onClick={goBack}><IoMdArrowBack/>{' '}Go back</span>
   <span className='btn bg-secondary bg-gradient text-white'onClick={()=>navigate('/')}><IoHome/>{' '}HomePage</span>
   </div>
   </div>
  )
}

export default Denied
