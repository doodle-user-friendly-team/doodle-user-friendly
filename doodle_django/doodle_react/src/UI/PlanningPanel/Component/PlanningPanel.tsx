import React, { useState } from 'react';
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";
import "../CSS/style.css";
import {PreferenceBaseComponent} from "../../Preference/Components/PreferenceBase";

export const PlanningPanelComponent = () => {
    const [newData, setNewData] = useState("");
    const [timeslotData, setTimeslotData] = useState("");

    const updateSharedData = (val: string) => {
        console.log("updateSharedData " + val);
        setNewData(val);
    };

    const updateTimeslotData = (val: string) => {
        setTimeslotData(val)
    }

    return (
        <div className="planningPanel">
            <CalendarBaseComponent updateNewData={updateSharedData} />
            <TimeSlotBaseComponent newData={newData} updateNewData={updateSharedData} updatePreferences={updateTimeslotData} />
            <PreferenceBaseComponent newData={timeslotData}/>
        </div>
    );
};