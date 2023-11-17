import React, { useState } from 'react';
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";

import "../CSS/style.css";

export const PlanningPanelComponent = () => {
    const [newData, setNewData] = useState("");

    const updateSharedData = (val: string) => {
        console.log("updateSharedData " + val);
        setNewData(val);
    };
    
    return (
        <div className="planningPanel">
            <CalendarBaseComponent updateNewData={updateSharedData} />
            <TimeSlotBaseComponent newData={newData} updateNewData={updateSharedData} />
        </div>
    );
};
