import Paragraph from "../../../component/Paragraph component/paragraph.component";
import "./fyp.style.scss";
const Fyp = () => {
  const fyptext =
    "   Mostly we address web related Projects in FYP. We will target Web Development. In Technical term, it is called Full Stack Developers.Generally it is very deep and applied term and cover major concepts to handle WOT/IOT.";
  const skillTest =
    "Some skills you learn through books, classroom, Presentation etc but Professional skills you must BAKE to understand Corporate Culture. Today’s World is very demanding and SO called Softskills are now driving force in Professional Career. In today’s era - Calling it ‘soft’ skills is underestimating its important. It implies it’s less important part of a person’s work-related skills. People often contrast it with “hard skills” ie coding or financial modeling or electronics design, for example, implying lower priority. As per Recent surveys, the companies that hire the tech talrnt look for a variation of :Attitude” , “critical thinking”,”maturity” and “being proactive” at the top of the list.";
  return (
    <div className="fyp-container">
      <div className="fyp-content">
        <div className="fyp-section">
          <div className="fyp-heading">
            <h3 className="fyp-heading-text">Introduction</h3>
          </div>
          <div className="fyp-section-content">
            <div className="fyp-text">
              <Paragraph text={fyptext} />
            </div>
            <div className="fyp-topic-table">
              <div className="technical-topic">
                <h2>Technical Topic</h2>
              </div>
              <div className="technical-topic-name">
                <div className="technical-topic-name-r">
                  <div className="technical-row-item">
                    <p>Ubnutu and Bash</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Git and Source Control</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Object Oriented Programming</p>
                  </div>
                </div>
                <div className="technical-topic-name-r">
                  <div className="technical-row-item">
                    <p>Relational Databases</p>
                  </div>
                  <div className="technical-row-item">
                    <p>PHP, Javascript, HTML, CSS</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Laravel/MVC</p>
                  </div>
                </div>
                <div className="technical-topic-name-r">
                  <div className="technical-row-item">
                    <p>React</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Security</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Amazon Web</p>
                  </div>
                  <div className="technical-row-item">
                    <p>Design Patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fyp-section">
          <div className="fyp-heading">
            <h3 className="fyp-heading-text">Our Approach</h3>
          </div>
          <div className="fyp-section-content">
            <div className="approach-table">
              <div className="approach-row">
                <div className="approach-row-item">
                  <p className="approach-text">Student Version</p>
                </div>
                <div className="approach-row-item">
                  <p className="approach-text">Basic</p>
                </div>
              </div>
              <div className="approach-row A-row-1">
                <div className="approach-row-item">
                  <p className="approach-text">Teacher Version</p>
                </div>
                <div className="approach-row-item">
                  <p className="approach-text">Medium/Advance</p>
                </div>
              </div>
              <div className="approach-row A-row-2">
                <div className="approach-row-item">
                  <p className="approach-text">Student Version</p>
                </div>
                <div className="approach-row-item">
                  <p className="approach-text">Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fyp-section">
          <div className="fyp-heading">
            <h3 className="fyp-heading-text">Skill</h3>
          </div>
          <div className="fyp-section-content">
            <div className="fyp-text">
              <Paragraph text={skillTest} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Fyp;
