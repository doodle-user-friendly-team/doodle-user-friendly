import React from "react";
import "../CSS/style.css";
import { ModifyProposedTimeSlot } from "../../EditTimeSlot/Component/ModifyTimeSlot";

import axios from "axios";
import Cookies from "js-cookie";

interface TimeSlotInfo {
  start_time: string;
  end_time: string;
  id: string;
  user: string;
}

interface formProps{
    dataSelected: string
    updateDatabase: () => void
    confirmTimeFunc: () => void;
}

interface FormState {
  startTime: string;
  endTime: string;
  confirmTimeFunc: () => void;
}

interface TimeSlotComponentState extends TimeSlotInfo {
  showProposedTimeSlot: boolean;
  formData: {
    name: string;
    surname: string;
    email: string;
  };
  
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

export class TimeSlotComponent extends React.Component<TimeSlotInfo, TimeSlotComponentState> {
  constructor(props: TimeSlotInfo) {
    super(props);
    this.state = {
      ...props,
      showProposedTimeSlot: false,
      formData: {
        name: "",
        surname: "",
        email: "",
      },
    };
  }

export class TimeSlotComponent extends React.Component<timeSlotProps, timeSlotInfo> {
    
    constructor(props: timeSlotProps) {
        super(props);
        this.state = {start_time: props.start_time, end_time: props.end_time, id: props.id}
    }
    
    getTimeFromDateTime = (dateTime: string): string => {
        return dateTime.substring(11, 16);
    }
    
     updateTimeslot = (updatedTimeslot: TimeSlotInfo): void => {
      this.setState({
        start_time: updatedTimeslot.start_time,
        end_time: updatedTimeslot.end_time,
      });
    };

    showTimeSlotForm = () => {
      this.setState({
        showProposedTimeSlot: true,
        formData: {
          name: '',
          surname: '',
          email: '',
        },
      });
    };

    closeTimeSlotForm = () => {
      this.setState({
        showProposedTimeSlot: false,
      });
    };

    handleFormSubmit = (data: { name: string; surname: string; email: string }) => {
      this.setState({
        formData: {
          name: data.name,
          surname: data.surname,
          email: data.email,
        },
      });
    };

    render() {
        return (
            <div className="selection-hour-container" onClick={() =>
                this.props.callback_update_preferences(this.props.id)
            }>
                <div className="text">Start: {this.getTimeFromDateTime(this.state.start_time)}</div>
                <div className="text">End: {this.getTimeFromDateTime(this.state.end_time)}</div>
                <div className="pseudo-button" onClick={this.showTimeSlotForm}>
                  Edit
                </div>
            {this.state.showProposedTimeSlot && (
              <ModifyProposedTimeSlot
                onDialogClose={this.closeTimeSlotForm}
                formData={this.state.formData}
                timeSlot={this.props}
                updateTimeslot={this.updateTimeslot}
              />
            )}
            </div>
        );
    }
    
    componentDidUpdate(prevProps: Readonly<timeSlotInfo>, prevState: Readonly<timeSlotInfo>, snapshot?: any) {
        if (this.state.start_time !== this.props.start_time || this.state.end_time !== this.props.end_time) {
            if (this.props.start_time !== undefined && this.props.end_time !== undefined)
                this.setState({start_time: this.props.start_time, end_time: this.props.end_time})
        }
    }
}
