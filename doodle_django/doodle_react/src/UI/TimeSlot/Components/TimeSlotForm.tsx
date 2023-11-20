import React from "react";
import "../CSS/style.css";
import axios from "axios";
import Cookies from "js-cookie";

interface timeSlotInfo{
    start_time: string
    end_time: string
    id: string
}

interface formProps{
    dataSelected: string
    updateDatabase: () => void
}

interface formState{
    startTime: string
    endTime: string
    confirmTimeFunc: () => void
}

interface timeSlotProps{
    start_time: string
    end_time: string
    id: string
    callback_update_preferences: (id: string) => void

}

export class TimeSlotFormComponent extends React.Component<formProps, formState >{
    
    data: string = ""
    INCR: number = 100; // 1 hour

    constructor(props: formProps) {
        super(props);
        this.state = {startTime: "00:00", endTime: "23:00", confirmTimeFunc: this.props.updateDatabase};
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
        let start_time = this.convertStringToTime(this.state.startTime);
        let end_time = this.convertStringToTime(this.state.endTime);

        let time = start_time + incr;

        if (time < 0)
            time = 0;
        else if (time > 23_59)
            time = 23_59;

        start_time = time;

        if ((start_time + incr) >= end_time)
            start_time = end_time - this.INCR;
        
        this.setState(() => {
            return {startTime: this.convertTimeToString(start_time), endTime: this.state.endTime, confirmTimeFunc: this.state.confirmTimeFunc};
        });
    }

    incrementEndTime = (incr: number): void => {
        let start_time = this.convertStringToTime(this.state.startTime);
        let end_time = this.convertStringToTime(this.state.endTime);

        let time = end_time + incr;

        if (time < 0)
            time = 0;
        else if (time > 23_59)
            time = 23_00;

        end_time = time;

        if ((end_time + incr) <= start_time)
            end_time = start_time + this.INCR;

        this.setState(() => {
            return {startTime: this.state.startTime, endTime: this.convertTimeToString(end_time), confirmTimeFunc: this.state.confirmTimeFunc};
        });
    }
    
    postTimeslot = (): void => {

        const day = this.props.dataSelected.substring(0, 2);
        const month = parseInt(this.props.dataSelected.substring(3, 5)) + 1;
        const year = this.props.dataSelected.substring(6, 10);

        let start_time_timeslot = year + '-' + month + '-' + day + 'T' + this.state.startTime + ':00Z'
        let end_time_timeslot = year + '-' + month + '-' + day + 'T' + this.state.endTime + ':00Z'

        const postData = {
            start_time: start_time_timeslot,
            end_time: end_time_timeslot,
            schedule_pool: 1,
            user: 1
        };

        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        };

        axios.post('http://localhost:8000/timeslots/', postData, { headers })
            .then((response) => {
                console.log("res:" + response);
                this.props.updateDatabase();
            })
            .catch((error) => {
                console.log(error);
            });

    }
    
    render() {
        
        return (
            <div className="form-container">
                <div className="start-hour-container">
                    I’m available from
                    <div className="form-bar">
                        <div className="pseudo-button" onClick={() => {
                            this.incrementStartTime(-this.INCR);
                        }}>◁</div> {this.state.startTime}
                        <div className="pseudo-button" onClick={() => {
                            this.incrementStartTime(this.INCR);
                        }}>▷</div>
                    </div>
                </div>
                <div className="end-hour-container">
                    To
                    <div className="form-bar">
                        <div className="pseudo-button" onClick={() => {
                        this.incrementEndTime(-this.INCR);
                    }}>◁</div> {this.state.endTime}
                        <div className="pseudo-button" onClick={() => {
                            this.incrementEndTime(this.INCR);
                        }}>▷</div>
                    </div>
                </div>
                
                <div className="confirm-button" onClick={this.postTimeslot}>Confirm</div>
            </div>
        );
    }
}


export class TimeSlotComponent extends React.Component<timeSlotProps, timeSlotInfo> {
    
    constructor(props: timeSlotProps) {
        super(props);
        this.state = props
    }
    
    getTimeFromDateTime = (dateTime: string): string => {
        return dateTime.substring(11, 16);
    }

    render() {
        return (
            <div className="selection-hour-container" onClick={() =>
                this.props.callback_update_preferences(this.props.id)
            }>
                <div className="text">Start: {this.getTimeFromDateTime(this.state.start_time)}</div>
                <div className="text">End: {this.getTimeFromDateTime(this.state.end_time)}</div>
                <div className="pseudo-button" onClick={() => {
                    console.log(this.state)
                }}>Edit
                </div>
            </div>
        );
    }
    
    componentDidUpdate(prevProps: Readonly<timeSlotInfo>, prevState: Readonly<timeSlotInfo>, snapshot?: any) {
        if (prevProps.start_time !== this.props.start_time || prevProps.end_time !== this.props.end_time) {
            this.setState({start_time: this.props.start_time, end_time: this.props.end_time})
        }
    }

    componentDidMount() {
        this.setState({start_time: this.props.start_time, end_time: this.props.end_time})
    }
}
