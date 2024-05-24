import { useEffect, useState } from "react";
import Layout from "../Components/Layout/Layout";
import Course from "./Course";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../Components/Store/CourseSlice";
import Select from "react-select";
import { fetchCategory } from "../Components/Store/CategorySlice";
import { CircularProgressbar } from "react-circular-progressbar";

export default function CourseList() {
  const [option, setOption] = useState([]);
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course?.courseData.data);
const loading=useSelector((state)=>state.course.loading)

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);
  useEffect(() => {
    const category = option?.length > 0 ? option[0]?.value : "";
    dispatch(fetchCourse(category));
    console.log(category);
  }, [option]);

  const categories = useSelector((state) => state.Categories.category.data);
  const categoryObject = categories?.map((options) => ({
    value: options._id,
    label: options.name,
  }));

  return (
    <>
      <Layout>
        <div className="course-container">
          <div className=" course-heading">
              <div className="c-image">
            <img className="img1" src="Assets/course2.png" alt="pic" width='450px' height='350px'></img>
            </div>
              <h1
                className="course-h1  "
                style={{ height: "100%", color: "black", fontFamily: "angkor" }}
              >
                All Courses
              </h1>
            
              
       
    
            <div className="c-image ">
            <img className="img3 " width='400px'height='400px' src="Assets/course.png" alt="pic"></img>
          </div>
          </div>
          
          <div className="course">
            <div className="select">
          <Select 
                menuPosition="fixed"
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    marginTop: "10px",
                    fontFamily: "TimesNewRoman",
                    width:'clamp(20rem,30vw,30rem)'
                  }),
                  menuList: (baseStyles) => ({
                    ...baseStyles,
                    marginTop: "10px",
                    height: "200px",
                    fontFamily: "TimesNewRoman",
                  }),
                }}
              
                options={categoryObject}
                searchable
                noOptionsMessage={() => "Invalid category"}
                placeholder="Select Category..."
                onChange={(e) => setOption([e])}
                isClearable>
                </Select>
                </div>
            <div className="row gap-4 m-5">
              {!loading?(
              courses?.length > 0 ? (
                courses?.map((course) => (
                  <Course {...course} source="allCourse" key={course.id} />
                ))
              ) : (
                <div className="d-flex justify-content-center">
                  <h4>No courses are available yet</h4>
                </div>
              )):(
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div className="spinner-border"style={{  }}role="status"> </div>
                  <span className="">fetching courses...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
