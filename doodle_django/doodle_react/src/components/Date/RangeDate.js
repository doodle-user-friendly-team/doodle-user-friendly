import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import CalendarDate from "./Calander";

function RangeDate({ onContraction, onExpand }) {
  const [dates, setDates] = useState(null);
  const sendDatesToBackend = async () => {
    try {
      if (dates) {
        const response = await fetch(
          // "https://your-backend-api-endpoint.com/save-dates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dates: dates }),
          }
        );

        if (response.ok) {
          console.log("Dates sent to the backend successfully!");
        } else {
          console.error("Failed to send dates to the backend.");
        }
      }
    } catch (error) {
      console.error("Error while sending dates to the backend:", error);
    }
  };

  return (
    <div onExpand={onExpand}>
      <CalendarDate />

      <Calendar
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="range"
        readOnlyInput
        onShow={() => onExpand(1)}
        onHide={() => onContraction(1)}
      />

      <button onClick={sendDatesToBackend}>Save</button>
    </div>
  );
}

export default RangeDate;
