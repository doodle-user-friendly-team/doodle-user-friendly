import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

export default function CalendarDate() {
  const endpoint = "http://127.0.0.1:8000/api/meetings/";

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState([
    "09:00",
    "10:00",
  ]);

  const handleSubmit = () => {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedDates),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data sent to the backend successfully!");

          setSelectedDates([]);
        } else {
          throw new Error("Failed to send data");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleDateClick = (value) => {
    const dateIndex = selectedDates.findIndex(
      (dateObj) => dateObj.date.toDateString() === value.toDateString()
    );
    if (dateIndex > -1) {
      const updatedDates = [...selectedDates];
      updatedDates.splice(dateIndex, 1);
      setSelectedDates(updatedDates);
    } else {
      setSelectedDates([
        ...selectedDates,
        { date: value, timeRange: [...selectedTimeRange] },
      ]);
    }
  };

  const handleTimeChange = (time, index) => {
    const updatedTimeRange = [...selectedTimeRange];
    updatedTimeRange[index] = time;
    setSelectedTimeRange(updatedTimeRange);
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      // Disable past days
      return date < new Date();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>Add time</h1>
        <Calendar
          onClickDay={(value) => handleDateClick(value)}
          value={selectedDates.map((dateObj) => dateObj.date)}
          tileDisabled={tileDisabled}
        />
      </div>
      <div style={{ flex: 1, marginLeft: 20 }}>
        <h2>Selected Dates:</h2>
        {selectedDates.length > 0 ? (
          <ul>
            {selectedDates.map((dateObj, index) => (
              <li key={index}>
                {dateObj.date.toDateString()} from {dateObj.timeRange[0]} to{" "}
                {dateObj.timeRange[1]}
              </li>
            ))}
          </ul>
        ) : (
          <p>No dates selected</p>
        )}

        <div>
          <h2>Select Time Range:</h2>
          <div>
            <TimePicker
              onChange={(time) => handleTimeChange(time, 0)}
              value={selectedTimeRange[0]}
              className="custom-time-picker"
            />
            <p>Start Time: {selectedTimeRange[0]}</p>
          </div>
          <div>
            <TimePicker
              onChange={(time) => handleTimeChange(time, 1)}
              value={selectedTimeRange[1]}
              className="custom-time-picker"
            />
            <p>End Time: {selectedTimeRange[1]}</p>
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
