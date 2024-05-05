// import all the components in this app 
import { Routes, Route } from "react-router-dom";
import CourseList from "./Pages/CourseList";
import Hero from "./Components/Hero/Hero";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { UserContextProvider } from "./UserContext";
import Contact from "./Pages/Admin/Contact";
import CreateCourse from "./Pages/Instructor/CreateCourse";
import CourseDescription from "./Pages/Instructor/CourseDescription";
import Profile from "./Pages/Profile";
import ViewCourse from "./Pages/Student/ViewCourse";
import EditProfile from "./Pages/EditProfile";
import MyCourse from "./Pages/Student/MyCourse";
import PdfViewer from "./Components/PdfViewer";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminCourse from "./Pages/Admin/AdminCourse";
import NotFound from './Pages/NotFound';
import Feedbacks from "./Pages/Admin/Feedbacks";
import AdminStudent from "./Pages/Admin/AdminStudent";
import AdminInstructors from "./Pages/Admin/AdminInstructors";
import AdminPayment from "./Pages/Admin/AdminPayment";
import CheckoutSuccess from "./Pages/Student/CheckoutSuccess";
import Orders from "./Pages/Student/Orders";
function App() {
  return (
    <>
    <UserContextProvider>
    <Routes>
        <Route path="/" element={<Hero />}>
         
        </Route>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/course" element={<CourseList />} />
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Signup" element={<Register />}></Route>
        <Route path='/profile'element={<Profile/>}></Route>
        <Route path='/profile/edit' element={<EditProfile />}></Route>
        <Route path="/create" element={<CreateCourse />}></Route>
        <Route path="/course/:id" element={<CourseDescription/>}></Route>
        <Route path="/myCourse" element={<MyCourse/>}></Route>
        <Route path="/myCourse/view/:id" element={<ViewCourse/>}></Route>
        <Route path="/file-viewer" element={<PdfViewer/>}></Route>
        <Route path="/Admin/Dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/Admin/courses" element={<AdminCourse/>}></Route>
        <Route path="/Admin/feedbacks" element={<Feedbacks/>}></Route>
        <Route path="/Admin/students" element={<AdminStudent/>}></Route>
        <Route path="/Admin/instructors" element={<AdminInstructors/>}></Route>
        <Route path="/Admin/payments" element={<AdminPayment/>}></Route>
        <Route path="/orders" element={<Orders/>}></Route>
        <Route path="/order-success" element={<CheckoutSuccess/>}></Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </UserContextProvider>
      
      
    </>
  );
}

export default App;
