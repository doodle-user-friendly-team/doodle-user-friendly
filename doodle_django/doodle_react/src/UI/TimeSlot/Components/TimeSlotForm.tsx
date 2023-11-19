import React from "react";
import "../CSS/style.css";

interface timeSlotInfo{
    start_time: string
    end_time: string
    id: string
}

interface formProps{
    confirmTimeFunc: () => void
}

interface formState{
    startTime: string
    endTime: string
    confirmTimeFunc: () => void
}

export class TimeSlotFormComponent extends React.Component<formProps, formState >{
    
    constructor(props: formState) {
        super(props);
        this.state = {startTime: "00:00", endTime: "00:00", confirmTimeFunc: this.props.confirmTimeFunc};
    }
    
    convertTimeToString = (time: number): string => {
        
        if (time === 0) 
            return "00:00";

        let timeString = time.toString();
        let hour = timeString.substring(0, timeString.length - 2);
        let minute = timeString.substring(timeString.length - 2, timeString.length);
        
        if (time < 1000)
            return "0" + hour + ":" + minute;
            
        
        return hour + ":" + minute;
    }
    
    convertStringToTime = (time: string): number => {
        let timeString = time.replace(":", "");
        return parseInt(timeString);
    }
    
    incrementStartTime = (incr: number): void => {
        let timeNumber = this.convertStringToTime(this.state.startTime);
        let time = timeNumber + incr;
        
        if (time < 0)
            time = 2300;
        else if (time > 2359)
            time = 0;
        
        timeNumber = time;
        
        this.setState(() => {
            return {startTime: this.convertTimeToString(timeNumber), endTime: this.state.endTime, confirmTimeFunc: this.state.confirmTimeFunc};
        });
    }

    incrementEndTime = (incr: number): void => {
        let timeNumber = this.convertStringToTime(this.state.endTime);
        let time = timeNumber + incr;

        if (time < 0)
            time = 2300;
        else if (time > 2359)
            time = 0;

        timeNumber = time;

        this.setState(() => {
            return {startTime: this.state.startTime, endTime: this.convertTimeToString(timeNumber), confirmTimeFunc: this.state.confirmTimeFunc};
        });
    }
    
    render() {
        
        return (
            <div className="selection-hour-container">
                <div className="start-hour-container">I’m available from
                    <div className="pseudo-button" onClick={() => {
                        this.incrementStartTime(-100);
                    }}>◁</div> {this.state.startTime}
                    <div className="pseudo-button" onClick={() => {
                        this.incrementStartTime(100);
                    }}>▷</div>
                </div>
                <div className="end-hour-container">To
                    <div className="pseudo-button" onClick={() => {
                    this.incrementEndTime(-100);
                }}>◁</div> {this.state.endTime}
                    <div className="pseudo-button" onClick={() => {
                        this.incrementEndTime(100);
                    }}>▷</div>
                </div>
                
                <div className="pseudo-button" onClick={this.state.confirmTimeFunc}>Confirm</div>
            </div>
        );
    }
}


export class TimeSlotComponent extends React.Component<timeSlotInfo, timeSlotInfo> {
    
    constructor(props: timeSlotInfo) {
        super(props);
        this.state = props
    }
    
    render() {
        return (
            <div className="selection-hour-container">
                <div className="start-hour-container">Start: {this.state.start_time}</div>
                <div className="end-hour-container">End: {this.state.end_time}</div>
                <div className="pseudo-button" onClick={() => {
                    console.log(this.state)
                }}>Edit
                </div>
            </div>
        );
    }
};
