import { ACCOUNT_TYPE } from "../utils/constants";
import { 
  VscAccount, 
  VscDashboard, 
  VscVm, 
  VscAdd, 
  VscMortarBoard,
  VscHistory,
  VscQuestion,
  VscGraph,
  VscFilePdf,
  VscSettingsGear
} from "react-icons/vsc";
import { IoCartOutline } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: VscAccount,
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscDashboard,
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscVm,
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscAdd,
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: VscMortarBoard,
  },
  {
    id: 6,
    name: "User Report",
    path: "/admin/report",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscHistory,
  },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: IoCartOutline,
  },
  {
    id: 8,
    name: "Manage Category",
    path: "/manage-category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscAdd,
  },
  {
    id: 9,
    name: "Course Report",
    path: "/admin/courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscFilePdf,
  },
  {
    id: 10,
    name: "Instructor Approval",
    path: "/admin/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscAccount,
  },
  {
    id: 11,
    name: "Instructor Analytics",
    path: "/admin/analytics",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscGraph,
  },
  {
    id: 12,
    name: "Student Doubts",
    path: "/doubt-list",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscQuestion
  },
  {
    id: 13,
    name: "Reviews",
    path: "/admin/reviews",
    type: ACCOUNT_TYPE.ADMIN,
    icon: VscGraph
  },
  {
    id: 14,
    name: "My Certificates",
    path: "/dashboard/my-certificates",
    icon: FaMedal,
    type: ACCOUNT_TYPE.STUDENT,
  }
];
