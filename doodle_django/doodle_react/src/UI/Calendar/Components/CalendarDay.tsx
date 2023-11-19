import React from "react";
import "../CSS/style.css";

interface calendarDayProps{
    day: string
    month: string
    year: string
    dayName: string
    type: string
    callback_update_timeslots: (day: string, month: string, year: string) => void
}

export function CalendarDayComponent (props: calendarDayProps) {
    return (
        <div className="component" onClick={() => {
            props.callback_update_timeslots(props.day, props.month, props.year);
        }}>
            <div className="group">
                <div className={props.type}>
                    <div className="date">{props.day}</div>
                </div>
            </div>
            <div className="content">
                <div className="day">{props.dayName}</div>
            </div>
        </div>
    );
};
