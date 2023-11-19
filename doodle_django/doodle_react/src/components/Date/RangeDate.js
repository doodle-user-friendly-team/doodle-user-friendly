import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import CalendarDate from "./Calander";

function RangeDate({ onContraction, onExpand, onDurationChange }) {
  const [dates, setDates] = useState(null);
  const [duration, setDuration] = useState(null);
 

  return (
    <div onExpand={onExpand}>
      <CalendarDate onDurationChange={onDurationChange} />

      <Calendar
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="range"
        readOnlyInput
        onShow={() => onExpand(1)}
        onHide={() => onContraction(1)}
      />

      <button >Save</button>
    </div>
  );
}

export default RangeDate;
