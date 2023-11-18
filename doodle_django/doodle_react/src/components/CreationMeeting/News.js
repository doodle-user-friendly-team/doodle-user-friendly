import "./news.css";

const News = ({ news, start, numberOfDivsNews }) => {
  return (
    <div>
      {news.slice(start, numberOfDivsNews).map((item, index) => (
        <a
          className="a_news"
          href={"https://www.unical.it" + item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
        >
          <div className="div_news">
            <img
              className="image_news"
              src={"https://www.unical.it" + item.image}
              alt={item.alt}
            />
            <h2>{item.title}</h2>
            <p>{item.subheading}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default News;
