import "./title.style.scss";
const Title = ({ text }) => {
  return (
    <div className="title-container">
      <div className="title">
        <h2>{text}</h2>
      </div>
    </div>
  );
};
export default Title;
