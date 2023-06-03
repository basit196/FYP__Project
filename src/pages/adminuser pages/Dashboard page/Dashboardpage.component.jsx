import Dashboardcarddirective from "../../../component/Dashboradcarddirective/Dashboardcarddirective.component";
import DashboardcarddirectiveData from "../../../Data/Dashboardcarddirective";
import "./Dashboardpage.styles.scss";

const DashboardPage = () => {
  return (
    <div className="DashboardPage">
      <div className="DashboardPage-heading">
        <h3>Welcome to Dashboard</h3>
      </div>
      <div className="DashboardPage-content">
        <Dashboardcarddirective array={DashboardcarddirectiveData} />
      </div>
    </div>
  );
};
export default DashboardPage;
