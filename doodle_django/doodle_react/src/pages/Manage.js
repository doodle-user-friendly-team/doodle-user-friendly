import ManageMeetingContainer from "../components/ManageMeeting/ManageMeetingContainer";
import news from "../news.json"
import { useState, useEffect } from "react";

const Manage = ( { meetingId = -1 } ) => {
  news.sort(() => Math.random() - 0.5);

  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      let url = "http://127.0.0.1:8000/api/meetings/"

      const response = await fetch(url);
      
      if (!response.ok)
        throw new Error('Meeting not found');
      
      const local_data = await response.json();
      var length = Object.keys (local_data).length

      // console.log("meetingId", meetingId)
      
      let index = meetingId
      if(meetingId === -1)
        index = length - 1
        // console.log("index", index)

      // console.log("MEETING index", local_data[index])
      setData(local_data[index]);
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
