import React from "react";
import "../CSS/style.css";
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";
import { FormComponent } from "../../Form/Component/FormIdentification";

export const PlanningPanelComponent = () => {
    return (
        <div className="planningPanel">
            <FormComponent/>
            <TimeSlotBaseComponent />
        </div>
    );
};