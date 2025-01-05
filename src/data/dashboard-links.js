import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "User Report",
    path: "/admin/report",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscHistory",
  },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "IoCartOutline",
  },
  {
    id: 8,
    name: "Manage Category",
    path: "/manage-category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "IoCartOutline",
  },
  {
    id: 9,
    name: "Course Report",
    path: "/admin/report/courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscHistory",
  },
  {
    id: 10,
    name: "Instructor Management",
    path: "/admin/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAccount",
  },
  {
    id: 11,
    name: "Instructor Analytics",
    path: "/admin/analytics",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscGraph",
  }
  
];
