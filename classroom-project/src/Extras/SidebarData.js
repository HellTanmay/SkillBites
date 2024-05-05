import { RiAdminLine, RiFeedbackLine } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { BiPurchaseTag,BiSolidPurchaseTag} from "react-icons/bi";
import { TbHexagonLetterC } from "react-icons/tb";
import { AiOutlineFolderView } from "react-icons/ai";
import { FaChartPie } from "react-icons/fa";


 export const Data = [
    {
      title: "DashBoard",
      icon: <FaChartPie/>,
      Link: "/Admin/Dashboard",
    },
    {
      title: "Courses",
      icon: <TbHexagonLetterC/>,
      Link: "/Admin/courses",
    },
    {
      title: "Instructors",
      icon: <GiTeacher />,
      Link: "/Admin/instructors",
    },
    {
      title: "Students",
      icon: <PiStudentFill />,
      Link: "/Admin/students",
    },
    {
      title: "Payments",
      icon: <BiSolidPurchaseTag />,
      Link: "/Admin/payments",
    },
    {
      title: "Feedbacks",
      icon: <RiFeedbackLine />,
      Link: "/Admin/feedbacks",
    },
  ];

  export const StudentData = [
    {
      key:1,
      title: "Profile",
      icon: <RiAdminLine />,
      Link: "/profile",
    },
    {
      key:2,
      title: "My Courses",
      icon: <AiOutlineFolderView/>,
      Link: "/myCourse",
    }, 
    {
      key:3,
      title: "Purchases",
      icon: <BiPurchaseTag/>,
      Link: "/orders",
    },  
  ];

  export const TeachData=[
    {
      key:1,
      title: "Profile",
      icon: <RiAdminLine />,
      Link: "/profile",
    },
    
  ]

