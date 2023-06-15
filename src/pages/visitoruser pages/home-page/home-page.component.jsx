import "./home-page.styles.scss";
import { useState } from "react";
import { useEffect } from "react";
import Footer from "../../../component/footer component/footer.component";
const HomePage = () => {
  const [Image, setImage] = useState(" ");
  useEffect(() => {
    fetch(
      "https://api.unsplash.com/search/photos?page=1&query=laptop&client_id=KBd4XvWiI4TXMW7Xbm3XrmHJMuCQJO--YtKN-DjWddI"
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        const { urls } = results[6];
        setImage({ image: urls.small });
      });
  }, []);
  const { image } = Image;
  return (
    <div className="home-content">
      <div className="home-container">
        <div className="right-container">
          <div className="image-side-text-container side-1">
            <p className="image-side-text">For the Students</p>
          </div>
          <div className="image-container">
            <div className="image-side-text-container side-2">
              <p className="image-side-text">With the Students</p>
            </div>

            <div
              className="background-image"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, rgb(0, 0, 0, 0.1), rgb(0, 0, 0, 0.1)),url(./images/homeImg.jpg)",
              }}
            />
          </div>

          <div className="image-side-text-container side-3">
            <p className="image-side-text">Through the Students</p>
          </div>
        </div>
        <div className="left-container">
          <p className="text">
            Institutions can improve. Cultures can improve. Systems can improve.
            Never all at once, but through a series of strategic leaps that
            build belief , increase confidence, & shape identity ___ setting in
            motion an arc of change that may not have seemed possible
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default HomePage;
