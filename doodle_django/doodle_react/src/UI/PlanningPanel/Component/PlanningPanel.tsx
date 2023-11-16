import React from "react";
import "../CSS/style.css";
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";
import { FormComponent } from "../../Form/Component/FormIdentification";

export const PlanningPanelComponent = () => {
    
    const [newData, setNewData] = React.useState(true);
    
    return (
        <div className="planningPanel">
            <CalendarBaseComponent  newDataSetter{setNewData}/>
            <TimeSlotBaseComponent  newData{newData}/>
        </div>
    );
};