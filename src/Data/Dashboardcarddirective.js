import {
  faUser,
  faLightbulb,
  faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";

const DashboardcarddirectiveData = [
  {
    backGroundColor: "#bbd0ff",
    icon: faUser,
    text: "Total User",
    color: "#00728e",
    url: "/admin/ManageUser",
    totalData: "user-data",
  },
  {
    backGroundColor: "#bbd0ff",
    icon: faLightbulb,
    text: "Total Ideas",
    color: "#ffd23f",
    url: "/admin/ViewAllIdeas",
    totalData: "idea-data",
  },
  {
    backGroundColor: "#bbd0ff",
    icon: faProjectDiagram,
    text: "Total Projects",
    color: "#673ab7",
    url: "/admin/ViewAllProjects",
    totalData: "project-data",
  },
];
export default DashboardcarddirectiveData;
