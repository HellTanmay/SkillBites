import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../Components/Store/CategorySlice";
import Select from 'react-dropdown-select'

const CreateCourse = () => {
  const [Title, setTitle] = useState("");
  const [Summary, setSummary] = useState("");
  const [Content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [Duration, setDuration] = useState(0);
  const [Price, setPrice] = useState(0);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("");

  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(fetchCategory())
  },[category])

  const categories=useSelector((state)=>state.Categories.category.data)
  const categoryObject=categories?.map(options=>({value:options._id,label:options.name}))

  const data = new FormData();
  const cat=category?.map(cat=>cat.value)

  async function create(e) {
    setLoading(true);
    data.set("title", Title);
    data.set("summary", Summary);
    data.set("content", Content);
    data.set("duration", Duration);
    data.set("price", Price);
    data.set("category", cat);
    data.set("file", file[0]);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/createCourse", {
        method: "POST",
        body: data,
        credentials: "include",
      });
        const response=await res.json()
      if (response.success) {
        toast.success(
          "The course will be available publicly after admin approval",
          { position: "top-center", autoClose: false }
        );
        setRedirect(true);
      }
      setError(response.message)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  if (redirect) {
    return <Navigate to={"/myCourse"}></Navigate>;
  }

  return (
    <Layout>
      {loading && (
        <div className="loader">
          <div className="spinner-border"
            style={{ position: "fixed", left: "50%", top: "50%" }}
            role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="createContainer ">
        <div className="">
          
          <form className="create" onSubmit={create}>
          <h1 className="text-center" style={{ fontFamily: "angkor" }}>
            Create course
          </h1>
          <div className="error">
           {error&& <p className="error-msg">{error}</p>}
          </div>
                <br />
            <input
              type="title"
              className="edit-text"
              style={{ width: "100%" }}
              placeholder={"Title"}
              value={Title}
              onChange={(ev) => setTitle(ev.target.value)}
              onBlur={()=>{Title.length>35?setError('Title must have less than 35 characters'):setError('')}}
              required
            />
            <br />
            <input
              type="summary"
              className="edit-text"
              style={{ width: "100%" }}
              placeholder={"Summary"}
              value={Summary}
              onChange={(ev) => setSummary(ev.target.value)}
              onBlur={()=>{Summary.length>100?setError('Summary cannot have more than 100 words'):setError('')}}
            />
            <br />
            <label for="image">
              Add Thumbnail:{" "}
              <input
                type="file"
                class=" form-control"
                id="inputGroupFile04"
                accept="image/*"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
                onChange={(ev) => setFile(ev.target.files)}
              />
            </label>
            <br />
            <div className="duration">
            <div className=" d-flex flex-column">
                <label for="desc">Set Duration(in months):</label>
                <select name="duration"
                className="edit-text"
                value={Duration}
                onChange={(e)=>setDuration(e.target.value)}>
                  <option value='2'>2</option>
                  <option value='4'>4</option>
                  <option value='6'>6</option>
                  <option value='8'>8</option>
                  <option value='10'>10</option>
                  <option value='12'>12</option>
                </select>
                </div>
                
          <div className=" d-flex flex-column">
            
            <label for="desc">Set Price(in rupees):</label>
            <input
              type="number"
              value={Price}
              className="edit-text"
             
              onChange={(ev) => setPrice(ev.target.value)}
              onBlur={()=>{Price>10000?setError('Price must be less than 10000'):setError('')}}
              required
            />
            <br />
            </div>
            </div>
            <label htmlFor="select">Select category</label>
             <Select className="" options={categoryObject} multi 
             color="#f97c7c"
            dropdownHeight="150px"
             style={{backgroundColor:'white'}}
             onChange={value=>setCategory(value)}searchable/>
             <br/>
            <label for="desc">Description:</label>
            <ReactQuill
              placeholder="List every information about the course"
              style={{ background: "white", border: "1px solid" }}
              onvalue={Content}
              id="desc"
              onChange={(newValue) => setContent(newValue)}
            />
            <br />
            <button className="create-btn">Create course</button>
            <br />
            <p style={{ fontSize: "10px" }}>
              Note:Only after the Admin Approval, the specified course will be
              published.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCourse;
