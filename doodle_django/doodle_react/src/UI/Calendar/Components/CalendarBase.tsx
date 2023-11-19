import "../CSS/style.css";
import React from "react";
import {CalendarDayComponent} from "./CalendarDay";
import Cookies from "js-cookie";

interface calendarState {
    currentMonth: number;
    currentYear: number;
    month: number;
    year: number;
}
interface calendarProps
{
    updateNewData:  (val: string) => void
}

export class CalendarBaseComponent extends React.Component<calendarProps, calendarState> {
    constructor(props: calendarProps) {
        super(props);
        this.state = { currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear(), month: new Date().getMonth(), year: new Date().getFullYear()};
    }
    
    dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    selectedDay = new Date().getDate();
    
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
        
        if (this.state.month + incM < 0)
            return;
        
        if (this.state.month + incM > 11)
            return;
        
        this.setState(() => {
            return { currentMonth: this.state.currentMonth, currentYear: this.state.currentYear, month: this.state.month + incM, year: this.state.year};
        });
    };
    
    incrementYear = (incY: number) => {
        if (this.state.year + incY < this.state.currentYear)
            return;
        
        let month = this.state.month;
        
        if (this.state.year + incY === this.state.currentYear && this.state.month < this.state.currentMonth)
            month = this.state.currentMonth;
        
        this.setState(() => {
            return { currentMonth: this.state.currentMonth, currentYear: this.state.currentYear, month: month, year: this.state.year + incY};
        });
    }
    
    updateTimeslots = (day: string, month: string, year: string) => {
        console.log(day, month, year);
        
        const paddedDay = day.padStart(2, '0');
        const paddedMonth = month.padStart(2, '0');

        const dateString = `${paddedDay}/${paddedMonth}/${year}`;

        this.selectedDay = parseInt(day);
        this.props.updateNewData(dateString);
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
                                return (<CalendarDayComponent selectedDay={this.selectedDay.toString()} day={day[0].toString()} dayName={day[1].toString()}
                                                              type={"overlap-group-red"} month={this.state.month.toString()} 
                                                              year={this.state.year.toString()} 
                                                              callback_update_timeslots={this.updateTimeslots}/>);
                            }
                            return (<CalendarDayComponent selectedDay={this.selectedDay.toString()} day={day[0].toString()} dayName={day[1].toString()}
                                                          type={"overlap-group-green"} month={this.state.month.toString()} 
                                                          year={this.state.year.toString()} 
                                                          callback_update_timeslots={this.updateTimeslots}/>);
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
    
    componentDidMount() {
        this.selectedDay = new Date().getDate();
        this.updateTimeslots(this.selectedDay.toString(), this.state.month.toString(), this.state.year.toString());
    }
};