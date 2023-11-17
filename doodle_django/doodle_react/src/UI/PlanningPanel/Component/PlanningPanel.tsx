import React from "react";
import "../CSS/style.css";
import {CalendarBaseComponent} from "../../Calendar/Components/CalendarBase";
import {TimeSlotBaseComponent} from "../../TimeSlot/Components/TimeSlotBase";
import { FormComponent } from "../../Form/Component/FormIdentification";
import {PreferenceBaseComponent} from "../../Preference/Components/PreferenceBase";

export const PlanningPanelComponent = () => {
    return (
        <div className="planningPanel">
            <FormComponent/>
            <TimeSlotBaseComponent />
            <PreferenceBaseComponent/>
        </div>
    );
};