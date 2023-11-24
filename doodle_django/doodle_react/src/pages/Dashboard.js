import DashboardGrid from "../components/Dashboard/DashboardGrid";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      let url = "http://127.0.0.1:8000/api/meetings/";

      const response = await fetch(url);

      if (!response.ok) throw new Error("Meeting not found");

      const local_data = await response.json();

      setData(local_data);
    } catch (error) {}
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return (
    <div>
      <DashboardGrid data={data} />
    </div>
  );
};

export default Dashboard;
