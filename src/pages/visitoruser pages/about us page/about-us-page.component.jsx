import Paragraph from "../../../component/Paragraph component/paragraph.component";
import CoverImage from "../../../component/cover-image component/cover-image.component";
import Footer from "../../../component/footer component/footer.component";
import "./about-us-page.styles.scss";
const AboutUsPage = () => {
  const aboutText = [
    {
      para: " This platform is created with an intention to challenge our students to drea things that never well ask . It was found that more then 90% percent of our graduates in final year project (FYP) did not meet industrial or community need but it is proven that in TOP institutes graduates Produce FYP cum ventures in a quest to change the world. They transform their ideas to successful startups. Now its time for us to emerge our students - no averse to risk, stay comfortably with ambiguity, & have the courage & conviction to realize their vision to future . In other words, our stidents produce Jobs - not seek Jobs.",
    },
    {
      para: "KUST Computer Science Department faculty partenerd with 3EEEz Digital to build a platform around the students & connect institution around Industry & Community. Through this callobration, both have confidence at transformation can lead to new opportunities for Applied learning with impact.",
    },
    {
      para: "These efforts are plan for the formation of a new innovative culture, adopted a student centered mindset across the department & a deep  digital transformation to better serve FYPs. Our sites are now set on the future & upskilling our students for 21st century jobs, on the top of that becoming a more diverse & equitable for industries & socities , & seizing opportunitiesto lead in the era of circular economy.. All with one prupose, to make healthy,productive & impactful community.",
    },
  ];

  return (
    <div className="about-us">
      <CoverImage imageUrl="./images/coverImg.jpg" text="ABOUT US" />
      <div className="about-us-text">
        {aboutText.map((paragraph) => {
          return <Paragraph text={paragraph.para} />;
        })}
      </div>
      <Footer />
    </div>
  );
};
export default AboutUsPage;
