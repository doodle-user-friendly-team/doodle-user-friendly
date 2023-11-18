import ManageMeetingContainer from "../components/ManageMeeting/ManageMeetingContainer";
import news from "../news.json"
import { useState, useEffect } from "react";

const Manage = ( { meetingId = -1 } ) => {
  news.sort(() => Math.random() - 0.5);

  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      console.log("meetingID", meetingId)
      let url = `http://127.0.0.1:8000/api/meeting/?id=${meetingId}`
      if(meetingId === -1)
        url = 'http://127.0.0.1:8000/api/meeting/last/'
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Meeting not found');
        const local_data = await response.json();
        setData(local_data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return (
    <div>
      <ManageMeetingContainer news={news} data={data}/>
    </div>
  );
};

export default Manage;
