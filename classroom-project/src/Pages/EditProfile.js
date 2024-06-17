import React, {useEffect, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchUser } from '../Components/Store/UserSlice';

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

  const dispatch=useDispatch()
  const userInfo=useSelector((state)=>state.User.userData)

  function handleInput(e){
    setuserData({...userdata, [e.target.name]: e.target.value, 
    })
  }

  useEffect(()=>{

    dispatch(fetchUser())
       setuserData({
          ...userdata,
          'username':userInfo.username,
          'email':userInfo.email,
          'gender':userInfo.gender,
          'bio':userInfo.bio,
          'phone':userInfo.phone,
          'address':userInfo.address,
        }
      )
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
    <div className='modal1'>
        <div className='modalcontainer'>
        {loading&&(<> <div className="loader">
    <div className="spinner-border"
            style={{ position: "fixed", left: "50%", top: "50%" }}role="status">
        <span className="sr-only"></span>
        </div>
     </div></>)}
          <div className='modal-title'>
            <h1 style={{marginLeft:'20px',fontFamily:'angkor'}}>Edit Profile</h1>
            <button onClick={()=>close1Modal(false)}><RiCloseFill style={{marginBottom:'20px',marginLeft:'-3px'}}/></button>
          </div>
          <div className='error'>
            {error&&<p className='error-msg'>{error}</p>}
          </div>
          <div className='modal-body'>
         
         <div className='row mb-4' >
              <div className='col-sm-2'>
           <label for="formFile"> Avatar</label>
            </div>
            <div className='col-sm-10'>
            <input type="file" className="edit-text form-control" id="inputGroupFile04"accept='image/*'
          name='avatar' onChange={(e) => setAvatar(e.target.files[0])}/>
          </div>
            </div>
            <div className='row mb-4' >
              <div className='col-sm-2 '>
            <label for='name'>Name</label>{' '}
            </div>
            <div className='col-sm-10'>
            <input type='text' className='edit-text'name='username' value={userdata.username} onChange={handleInput} id='name' ></input><br/>
            </div>
            </div>
            
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label for='Email'>Gender</label>{' '}
            </div>
            <div className='col-sm-10'>
            <input type='radio'name='gender'value='Male'checked={userdata.gender==='Male'} onChange={handleInput}/>Male{' '}
            <input type="radio" name='gender' value="Female"checked={userdata.gender==='Female'}  onChange={handleInput}/>Female
           </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Description</label>{' '}
            </div>
            <div className='col-sm-10'>
            <input type='text'className='edit-text'name='bio' value={userdata.bio} onChange={handleInput} placeholder='Description'></input>
            </div>
            </div>
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Mobile</label>{' '}
            </div>
            <div className='col-sm-10'>
            <input type='number' className='edit-text'name='phone' value={userdata.phone} onChange={handleInput}
             placeholder='Enter your  mobile number'/>
            </div>
            </div> 
            <div className='row mb-4'>
              <div className='col-sm-2'>
            <label>Address</label>{' '}
            </div>
            <div className='col-sm-10'>
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
