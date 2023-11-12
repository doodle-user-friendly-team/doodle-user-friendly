import "../CSS/style.css";
import React from "react";
import {CalendarDayComponent} from "./CalendarDay";

interface calendarState {
    currentMonth: number;
    currentYear: number;
    month: number;
    year: number;
}

export class CalendarBaseComponent extends React.Component<{}, calendarState> {
    constructor(props: {}) {
        super(props);
        this.state = { currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear(), month: new Date().getMonth(), year: new Date().getFullYear()};
    }

    dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    getMonthDays = () => {
        let lastDay = new Date(this.state.year, this.state.month + 1, 0);
        let startDay = (this.state.month === this.state.currentMonth && this.state.year === this.state.currentYear) ? new Date().getDate() : 1;
        let dayIdx = new Date(this.state.year, this.state.month, startDay).getDay();
        
        let remainingDays: ((string | number)[])[] = [];
        for (let i = startDay; i <= lastDay.getDate(); i++) {
            remainingDays.push([i, this.dayName[dayIdx++ % 7]]);
        }
        return remainingDays;
    }

    incrementMonth = (incM: number) => {
        if (this.state.month + incM < this.state.currentMonth && this.state.year === this.state.currentYear)
            return;
        
        this.setState(() => {
            return { currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear(), month: this.state.month + incM, year: this.state.year};
        });
    };
    
    incrementYear = (incY: number) => {
        if (this.state.year + incY < this.state.currentYear)
            return;
        
        let month = this.state.month;
        
        if (this.state.year + incY === this.state.currentYear && this.state.month < this.state.currentMonth)
            month = this.state.currentMonth;
        
        this.setState(() => {
            return { currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear(), month: month, year: this.state.year + incY};
        });
    }
    
    render()
    {
        const restDays = [this.dayName[0], this.dayName[6]];
        
        return (
            //make a table with 3 columns
            <div className="calendar">
                <div className="calendarDate">
                    {
                        //make a column for each day
                        this.getMonthDays().map((day) => {
                            if (day[1].toString() === restDays[0] || day[1].toString() === restDays[1]) {
                                return (<CalendarDayComponent day={day[0].toString()} dayName={day[1].toString()}
                                                              type={"overlap-group-red"}/>);
                            }
                            return (<CalendarDayComponent day={day[0].toString()} dayName={day[1].toString()}
                                                          type={"overlap-group-green"}/>);
                        })
                    }
                </div>
                <div className="box">
                    <div className="anni">
                        <div className="overlap-group">
                            <div className="pseudo-button-left" onClick={() => this.incrementYear(-1)}>◁</div>
                            <div className="pseudo-button-right" onClick={() => this.incrementYear(1)}>▷</div>
                            <div className="year-text-wrapper">{this.state.year}</div>
                        </div>
                    </div>
                    <div className="mesi">
                        <div className="overlap-group">
                            <div className="pseudo-button-left" onClick={() => this.incrementMonth( -1)}>◁</div>
                            <div className="pseudo-button-right" onClick={() => this.incrementMonth( 1)}>▷</div>
                            <div className="month-text-wrapper">{this.monthName[this.state.month % this.monthName.length]}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
