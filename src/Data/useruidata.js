import {
  faClock,
  faCommentDots,
  faFileAlt,
  faFileCode,
  faFileContract,
  faFileUpload,
  faFolderOpen,
  faHome,
  faLightbulb,
  faProjectDiagram,
  faUserEdit,
  faUserPlus,
  faUsers,
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
      {
        link: "Upload Proposal ",
        to: "/student/uploadproposal",
        icon: faFileUpload,
      },
      {
        link: "Submitted Proposal",
        to: "/student/submittedProposal",
        icon: faFileContract,
      },
      {
        link: "Upload Project",
        to: "/student/uploadproject",
        icon: faProjectDiagram,
      },
      {
        link: "View Project",
        to: "/student/viewproject",
        icon: faFolderOpen,
      },
    ],
  },
  {
    Role: "Supervisor",
    links: [
      { link: "Upload Idea", to: "/supervisor", icon: faLightbulb },
      {
        link: "Under Supervision",
        to: "/supervisor/undersupervision",
        icon: faCommentDots,
      },
      {
        link: "View Mid Project",
        to: "/supervisor/viewmidproject",
        icon: faFileCode,
      },
      {
        link: "View Final Project",
        to: "/supervisor/viewfinalproject",
        icon: faFileCode,
      },
    ],
  },
  {
    Role: "Panel",
    links: [
      { link: "Set Deadline", to: "/panel", icon: faClock },
      { link: "View Proposals", to: "/panel/proposals", icon: faFileAlt },
      {
        link: "View Defense Projects ",
        to: "/panel/viewdefenseproject",
        icon: faFileCode,
      },
      {
        link: "View Old Proposals ",
        to: "/panel/viewoldproposal",
        icon: faFileCode,
      },
    ],
  },
  {
    Role: "Company Owner",
    links: [
      { link: "Upload Idea", to: "/companyowner", icon: faLightbulb },
      { link: "Selected By", to: "/companyowner/selectedby", icon: faUsers },
    ],
  },
];
export default UserUiData;
