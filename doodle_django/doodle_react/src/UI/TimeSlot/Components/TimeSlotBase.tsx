import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../CSS/style.css";
import { TimeSlotComponent, TimeSlotFormComponent } from "./TimeSlotForm";
import Cookies from "js-cookie";

export interface timeSlotInfo{
    id: string
    start_time: string
    end_time: string
    user: string
}

interface TimeSlotBaseProps {
    newData: string;
    updateNewData: (val: string) => void;
    updatePreferences: (id: string) => void;
}

const TimeSlotBaseComponent: React.FC<TimeSlotBaseProps> = ({ newData, updateNewData, updatePreferences }) => {
    const [creationMode, setCreationMode] = useState(false);
    const [timeSlots, setTimeSlots] = useState<timeSlotInfo[]>([]);

    useEffect(() => {
        getGetTimeSlots(false);
    }, [newData]);

    const addNewTimeSlot = () => {
        setCreationMode(true);
    };

    const getGetTimeSlots = (creationMode: boolean): void => {
        const [day, month, year] = newData.split('/');

        if (day !== undefined && month !== undefined && year !== undefined)
            axios.get(`http://localhost:8000/timeslots/?day=${day}&month=${month}&year=${year}`)
                .then((response: { data: timeSlotInfo[] }) => {
                    setTimeSlots(response.data);
                    setCreationMode(creationMode);
                });
    }


    const hideTimeSlotForm = (): void => {
        setCreationMode(false);
    };

    const updateDatabase = (): void => {
        getGetTimeSlots(false);
    };

    return (
        <div className="timeslot-panel">
            <div className="add-button">
                {!creationMode ?
                    <div className="text" onClick={addNewTimeSlot}>+</div> :
                    <div className="text" onClick={hideTimeSlotForm}>-</div>
                }
            </div>
            <div className="time-slot-container">
                {timeSlots.map((ts) => (
                    <TimeSlotComponent key={ts.id} id={ts.id} start_time={ts.start_time} end_time={ts.end_time} user={ts.user} callback_update_preferences={updatePreferences}/>
                ))}
                {creationMode && <TimeSlotFormComponent updateDatabase={updateDatabase} dataSelected={newData} />}
            </div>
        </div>
    );
};

export default TimeSlotBaseComponent;