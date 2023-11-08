import React from "react";
import {CalendarDayComponent} from "./CalendarDay";
import {CalendarBarComponent} from "./CalendarBar";
import "../CSS/style.css";

export function CalendarBaseComponent () {
    //get the current date
    var currentDate = new Date();
    //get the current day number and day name
    let day = currentDate.getDate();
    let dayName = ["Sunday", "Monday", "T", "W", "T", "Friday", "Saturday"];
    let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dicember"];
    
    const restDays = [dayName[0], dayName[6]];
    
    //get last day of the month
    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    //array contains the day number and day name
    let remainingDays: ((string | number)[])[] = [];
    for (let i = day; i <= lastDay.getDate(); i++) {
        remainingDays.push([i, dayName[(day + i + 1) % 7]]);
    }

    return (
        //make a table with 3 columns
        <div className="calendar">
            <div className="calendarDate">
                {
                    //make a column for each day
                    remainingDays.map((day) => {
                        if (day[1].toString() === restDays[0] || day[1].toString() === restDays[1]) {
                            return (<CalendarDayComponent day={day[0].toString()} dayName={day[1].toString()} type={"overlap-group-red"}/>);
                        }
                        return (<CalendarDayComponent day={day[0].toString()} dayName={day[1].toString()} type={"overlap-group-green"}/>);
                    })
                }
            </div>
            <CalendarBarComponent year={currentDate.getFullYear().toString()} month={monthName[currentDate.getMonth()].toString()}/>
        </div>
);
};
