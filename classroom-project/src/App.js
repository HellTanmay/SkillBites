// import all the components in this app 

import { Routes, Route, Navigate, Outlet,useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import Denied from "./Pages/Denied";


const CourseList = lazy(()=>import("./Pages/CourseList"));
const Hero = lazy(()=>import("./Components/Hero/Hero"));
const Login = lazy(()=>import("./Pages/Login"));
const Register = lazy(()=>import("./Pages/Register"));
const Contact = lazy(()=>import("./Pages/Admin/Contact"));
const CreateCourse = lazy(()=>import("./Pages/Instructor/CreateCourse"));
const CourseDescription = lazy(()=>import("./Pages/Instructor/CourseDescription"));
const Profile = lazy(()=>import("./Pages/Profile"));
const ViewCourse = lazy(()=>import("./Pages/Student/ViewCourse"));
const EditProfile = lazy(()=>import("./Pages/EditProfile"));
const MyCourse = lazy(()=>import("./Pages/Student/MyCourse"));
const PdfViewer = lazy(()=>import("./Components/PdfViewer"));
const AdminDashboard = lazy(()=>import("./Pages/Admin/AdminDashboard"));
const AdminCourse = lazy(()=>import("./Pages/Admin/AdminCourse"));
const NotFound = lazy(()=>import("./Pages/NotFound"));
const Feedbacks = lazy(()=>import("./Pages/Admin/Feedbacks"));
const AdminStudent = lazy(()=>import("./Pages/Admin/AdminStudent"));
const AdminInstructors = lazy(()=>import("./Pages/Admin/AdminInstructors"));
const AdminPayment = lazy(()=>import("./Pages/Admin/AdminPayment"));
const CheckoutSuccess = lazy(()=>import("./Pages/Student/CheckoutSuccess"));
const Orders = lazy(()=>import("./Pages/Student/Orders"));
const AddCategory = lazy(()=>import("./Pages/Admin/AddCategory"));


  const AllowRoles = ({ allowedRoles }) => {
    const { isLoggedIn, role } = useSelector((state) => state.User);
    const location = useLocation();
  
    return isLoggedIn && allowedRoles.find((myRole) => myRole === role) ? (
      <Outlet />
    ) : isLoggedIn ? (
      <Navigate to={"/denied"} state={{ from: location }} replace />
    ) : (
      <Navigate to={"/login"} state={{ from: location }} replace />
    );
  };


function App() {
  return (
    <>
    <Suspense fallback={<div className="d-flex align-items-center justify-content-center"style={{height:'100vh'}}>
      <p>SkillBites</p>
      </div>} >
    <Routes>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Signup" element={<Register />}></Route>

        <Route path="/contact" element={<Contact/>}/>
        
        <Route path="/" element={<Hero />}></Route>

        <Route element={<AllowRoles allowedRoles={['Student','Instructor']}/>}>
        <Route path="/course" element={<CourseList />} />
        <Route path='/profile'element={<Profile/>}></Route>
        <Route path='/profile/edit' element={<EditProfile />}></Route>
        <Route path="/myCourse" element={<MyCourse/>}></Route>
        <Route path="/course/:id" element={<CourseDescription/>}></Route>
        <Route path="/myCourse/view/:id" element={<ViewCourse/>}></Route>
        <Route path="/file-viewer" element={<PdfViewer/>}></Route>

        </Route >
        <Route element={<AllowRoles allowedRoles={['Student']}/>}>
        <Route path="/order-success" element={<CheckoutSuccess/>}></Route>
        <Route path="/orders" element={<Orders/>}></Route>

        </Route>

        <Route element={<AllowRoles allowedRoles={['Instructor']}/>}>
        <Route path="/create" element={<CreateCourse />}></Route>
        </Route >

        <Route element={<AllowRoles allowedRoles={['Admin']}/>}>
        <Route path="/Admin/Dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/Admin/courses" element={<AdminCourse/>}></Route>
        <Route path="/Admin/feedbacks" element={<Feedbacks/>}></Route>
        <Route path="/Admin/students" element={<AdminStudent/>}></Route>
        <Route path="/Admin/instructors" element={<AdminInstructors/>}></Route>
        <Route path="/Admin/payments" element={<AdminPayment/>}></Route>
        <Route path="/Admin/addCategories" element={<AddCategory/>}></Route>
        </Route>

        <Route path="/denied" element={<Denied/>} />
        <Route path="*" element={<NotFound/>} />


       
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
