
import { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { useDispatch } from "react-redux";
import { AddContact } from "../../Components/Store/ExtraSlice";
import {toast} from 'react-hot-toast'

const Contact = () => {
  const dispatch=useDispatch()
  const [contact,setContact]=useState({
    'username':'',
    'email':'',
    'message':'',
})
function handleInput(e){
  setContact({...contact, [e.target.name]: e.target.value, 
  }) 
}

async function contactData(e){
  e.preventDefault()
  const res=await dispatch(AddContact(contact))
  if(res.payload.success){
    toast.success('Submitted successfully')
    setContact({'username':'',
                'email':'',
                'message':''})
  }else{
    toast.error(res.payload.message)
  }
  
}
  return (
    <Layout>
   <div className="contact-page">
      <div className="Container-contact">
        <h1>How can we help you?</h1>
        <form className="row g-3" onSubmit={contactData}>
          <div className="col-md-6">
            <label for="inputName4" className="form-label">
              Name
            </label>
            <input type="text" className="form-control" id="inputName4" name='username' value={contact.username} onChange={handleInput} />
          </div>
          <div className="col-md-6">
            <label for="inputEmail4" className="form-label">
              Email
            </label>
            <input type="text" className="form-control" id="inputEmail4"name='email'value={contact.email}onChange={handleInput} />
          </div>
          <div className="col-12">
          <label for="textContent" className="form-label">
              Message
            </label>
            <textarea  className="form-control" id="textContent"name='message'value={contact.message}onChange={handleInput} />
            </div>
        
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </div>
        </form>
      </div>
      </div>
      </Layout>
  );
};

export default Contact;
