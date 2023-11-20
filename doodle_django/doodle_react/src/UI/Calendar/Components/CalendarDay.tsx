import React, {useState} from "react";
import "../CSS/style.css";

interface CalendarDayProps {
    day: string;
    month: string;
    year: string;
    dayName: string;
    type: string;
    selectedDay: string;
    callback_update_timeslots: (day: string, month: string, year: string) => void;
}

export class CalendarDayComponent extends React.Component<CalendarDayProps> {
    constructor(props: CalendarDayProps) {
        super(props);
    }

    render()
    {

        const handleDayClick = () => {
            this.props.callback_update_timeslots(this.props.day, this.props.month, this.props.year);
        };
        
        return (
            <div className={this.props.day === this.props.selectedDay ? "daySelected" : "dayNotSelected"} onClick={handleDayClick}>
                <div className="component">
                    <div className="group">
                        <div className={this.props.type}>
                            <div className="date">{this.props.day}</div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="day">{this.props.dayName}</div>
                    </div>
                </div>
            </div>
        );
    }
}