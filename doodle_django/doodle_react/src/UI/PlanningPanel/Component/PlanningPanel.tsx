import React from "react";
import "../CSS/style.css";
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";

export const PlanningPanelComponent = () => {
    return (
        <div className="planningPanel">
            <CalendarBaseComponent />
            <TimeSlotBaseComponent />
        </div>
    );
};