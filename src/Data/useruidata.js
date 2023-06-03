import {
  faFile,
  faFileContract,
  faFolderOpen,
  faHome,
  faLightbulb,
  faProjectDiagram,
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
const UserUiData = [
  {
    Role: "Admin",
    links: [
      { link: "Dashboard", to: "/admin", icon: faHome },
      { link: "Register User", to: "/admin/RegisterUser", icon: faUserPlus },
      { link: "Manage User", to: "/admin/ManageUser", icon: faUserEdit },

      {
        link: "Manage ideas",
        to: "/admin/ViewAllIdeas",
        icon: faLightbulb,
      },
      {
        link: "Manage Projects",
        to: "/admin/ViewAllProjects",
        icon: faProjectDiagram,
      },
    ],
  },
  {
    Role: "Student",
    links: [
      { link: "Dashboard", to: "/student", icon: faHome },
      { link: "View Ideas", to: "/student/viewideas", icon: faLightbulb },
      { link: "Upload Proposal ", to: "/student/uploadproposal", icon: faFile },
      {
        link: "View Proposal",
        to: "/student/viewproposal",
        icon: faFileContract,
      },
      {
        link: "Upload Project",
        to: "/student/uploadproject",
        icon: faProjectDiagram,
      },
      {
        link: "View Project",
        to: "/student/uploadproject",
        icon: faFolderOpen,
      },
    ],
  },
  {
    Role: "Supervisor",
    links: [
      { link: "Dashboard" },
      { link: "Upload Idea" },
      { link: "" },
      { link: "" },
    ],
  },
  {
    Role: "Panel",
    links: [
      { link: "Dashboard" },
      { link: "" },
      { link: "View all ideas" },
      { link: "View all Projects" },
    ],
  },
  {
    Role: "Company Owner",
    links: [
      { link: "Dashboard" },
      { link: "Manage User" },
      { link: "View all ideas" },
      { link: "View all Projects" },
    ],
  },
];
export default UserUiData;
