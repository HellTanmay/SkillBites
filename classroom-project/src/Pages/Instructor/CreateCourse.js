import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCourse = () => {
  const [Title, setTitle] = useState("");
  const [Summary, setSummary] = useState("");
  const [Content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [Duration, setDuration] = useState(0);
  const [Price, setPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("");
  const data = new FormData();

  async function create(e) {
    setLoading(true);
    data.set("title", Title);
    data.set("summary", Summary);
    data.set("content", Content);
    data.set("duration", Duration);
    data.set("price", Price);
    data.set("file", file[0]);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/course", {
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
    return <Navigate to={"/"}></Navigate>;
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
            <div className=" d-flex flex-row justify-content-around">
            <div className=" d-flex flex-column">
                <label for="desc">Set Duration(in months):</label>
                
                <input
                  type="number"
                  className="edit-text"
                  style={{ width: "200px" }}
                  value={Duration}
                  max="12"
                  onBlur={() => {
                    Duration > 12
                      ? setError("maximum 12 months!")
                      : setError("");
                  }}
                  onChange={(ev) => setDuration(ev.target.value)}
                  required
                />
                </div>
          <div className=" d-flex flex-column">
            <label for="desc">Set Price(in rupees):</label>
      
            <input
              type="number"
              value={Price}
              className="edit-text"
              style={{ width: "200px" }}
              onChange={(ev) => setPrice(ev.target.value)}
              onBlur={()=>{Price>10000?setError('Price must be less than 10000'):setError('')}}
              required
            />
            <br />
            </div>
            </div>
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
