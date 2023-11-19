import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../CSS/style.css";
import { TimeSlotComponent, TimeSlotFormComponent } from "./TimeSlotForm";
import Cookies from "js-cookie";

interface TimeSlotInfo {
    id: string;
    start_time: string;
    end_time: string;
}

interface TimeSlotBaseProps {
    newData: string;
    updateNewData: (val: string) => void;
}

const TimeSlotBaseComponent: React.FC<TimeSlotBaseProps> = ({ newData, updateNewData }) => {
    const [creationMode, setCreationMode] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlotInfo[]>([]);

    useEffect(() => {
        getGetTimeSlots(false);
    }, [newData]);

    const addNewTimeSlot = () => {
        setCreationMode(true);
    };

    const getGetTimeSlots = (creationMode: boolean): void => {
        const [day, month, year] = newData.split('/');
        axios.get(`http://localhost:8000/timeslots/?day=${day}&month=${month}&year=${year}`)
            .then((response: { data: TimeSlotInfo[] }) => {
                setTimeSlots(response.data);
                setCreationMode(creationMode);
            });
    };

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
                    <TimeSlotComponent key={ts.id} id={ts.id} start_time={ts.start_time} end_time={ts.end_time} />
                ))}
                {creationMode && <TimeSlotFormComponent updateDatabase={updateDatabase} dataSelected={newData} />}
            </div>
        </div>
    );
};

export default TimeSlotBaseComponent;
