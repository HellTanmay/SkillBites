import { RiAdminLine, RiFeedbackLine,RiAddCircleLine } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { BiPurchaseTag,BiSolidPurchaseTag} from "react-icons/bi";
import { TbHexagonLetterC } from "react-icons/tb";
import { AiOutlineFolderView } from "react-icons/ai";
import { FaChartPie } from "react-icons/fa";
import { IoCreateSharp } from "react-icons/io5";


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
      title: "Add categories",
      icon: <RiAddCircleLine/>,
      Link: "/Admin/addCategories",
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
    {
      key:1,
      title: "Create course",
      icon: <IoCreateSharp/>,
      Link: "/create",
    },
    {
      key:1,
      title: "View Course",
      icon: <AiOutlineFolderView />,
      Link: "/myCourse",
    },
  ]

