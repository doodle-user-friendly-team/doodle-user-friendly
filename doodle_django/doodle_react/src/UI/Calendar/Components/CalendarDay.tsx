import React from "react";
import "../CSS/style.css";

export function CalendarDayComponent (props: { day: string; dayName: string; type: string;}) {
    return (
        <div className="component">
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
