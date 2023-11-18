import CreateGroupPolly from "../components/CreationMeeting/CreateGroupPolly";
import news from "../news.json"

const Creation = () => {
  news.sort(() => Math.random() - 0.5);
  
  return (
    <div>
      <CreateGroupPolly news={news} />
    </div>
  );
};

export default Creation;
