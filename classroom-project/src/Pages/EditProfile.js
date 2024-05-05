import React, {useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const EditProfile = ({close1Modal,user}) => {
  const [avatar,setAvatar]=useState('');
  const [error,setError]=useState()
  const [loading,isLoading]=useState(false)
  const [userdata,setuserData]=useState({
      'username':'',
      'email':'',
      'gender':'',
      'bio':'',
      'phone':'',
      'address':'',
  })

  function handleInput(e){
    setuserData({...userdata, [e.target.name]: e.target.value, 
    })
  }

  useEffect(()=>{
    fetch('http://localhost:4000/profile',{
      credentials:'include',
    })
    .then((response)=>{
      response.json()
      .then ((data)=>
      setuserData({
        ...userdata,
        'username':data.username,
        'email':data.email,
        'gender':data.gender,
        'bio':data.bio,
        'phone':data.phone,
        'address':data.address,
      }
    ))
    }) 
  },[])
 
  
    async function edit(e){
      e.preventDefault();
      isLoading(true)
      const formData = new FormData();
      formData.append('avatar', avatar);
      Object.entries(userdata).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try{
      const res=await fetch("http://localhost:4000/profile/edit",{
        credentials:'include',
        method:'PUT',
        body:formData,
      })
      const data=await res.json()
      console.log(data)
      user(data)
          if(data.success){
            close1Modal(false);
            toast.success('Updated successfully',{position:'top-center'})
          }
          setError(data.message)
      }catch(err)
      {
          console.log(err.message)
      }
      finally{
        isLoading(false)
      }
  }
  
  return (
    <div className='modal1' style={{position:'absolute'}}>
       {loading&&(<> <div className="loader">
    <div className="spinner-border"
            style={{ position: "fixed", left: "50%", top: "50%" }}role="status">
        <span className="sr-only"></span>
        </div>
     </div></>)}
 
        <div className='modalcontainer'>
          <button className='btn rounded-pill btn-danger' style={{float:'right',marginRight:'13px',marginTop:'10px'}} onClick={()=>close1Modal(false)}>X</button>
          <div className='modal-title'>
            <h1 style={{marginLeft:'20px',fontFamily:'angkor'}}>Edit Profile</h1>
          </div>
          <div className='error'>
            {error&&<p className='error-msg'>{error}</p>}
          </div>
          <div className='modal-body'>
         
         <div className='row mb-4' >
              <div className='col-sm-2'>
           <label for="formFile"> Avatar</label>
            </div>
            <div className='col-sm-6'>
            <input type="file" className="edit-text form-control" id="inputGroupFile04"accept='image/*'
          name='avatar' onChange={(e) => setAvatar(e.target.files[0])}/>
          </div>
            </div>
            <div className='row mb-4' >
              <div className='col-sm-2 '>
            <label for='name'>Name</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='text' className='edit-text'name='username' value={userdata.username} onChange={handleInput} id='name' ></input><br/>
            </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label for='Email'>Email</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='text'className='edit-text'name='email' value={userdata.email} onChange={handleInput} placeholder='Email'id='Email'></input>
           </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label for='Email'>Gender</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='radio'name='gender'value='Male'checked={userdata.gender==='Male'} onChange={handleInput}/>Male{' '}
            <input type="radio" name='gender' value="Female"checked={userdata.gender==='Female'}  onChange={handleInput}/>Female
           </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Description</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='text'className='edit-text'name='bio' value={userdata.bio} onChange={handleInput} placeholder='Description'></input>
            </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Mobile</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='number'className='edit-text'name='phone' value={userdata.phone} onChange={handleInput}
             placeholder='Enter your  mobile number'/>
            </div>
            </div> 
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Address</label>{' '}
            </div>
            <div className='col-sm-6'>
            <input type='text'className='edit-text' name='address' value={userdata.address} onChange={handleInput}  placeholder='Where are you from?'></input>
            </div>
            </div>
            <div className='modal-footer'>

                <button className='btn btn-md btn-danger'onClick={edit}>Save Changes</button>
            </div>
          </div>
        </div>
    </div>

  )
}

export default EditProfile
