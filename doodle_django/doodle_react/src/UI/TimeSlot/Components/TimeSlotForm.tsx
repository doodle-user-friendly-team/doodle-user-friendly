import React from "react";
import "../CSS/style.css";
import { ModifyProposedTimeSlot } from "../../EditTimeSlot/Component/ModifyTimeSlot";

interface TimeSlotInfo {
  start_time: string;
  end_time: string;
  id: string;
}

interface FormProps {
  confirmTimeFunc: () => void;
}

interface FormState {
  startTime: string;
  endTime: string;
  confirmTimeFunc: () => void;
}

export class TimeSlotFormComponent extends React.Component<FormProps, FormState> {
  constructor(props: FormState) {
    super(props);
    this.state = { startTime: "00:00", endTime: "00:00", confirmTimeFunc: this.props.confirmTimeFunc };
  }

  convertTimeToString = (time: number): string => {
    if (time === 0) return "00:00";

    let timeString = time.toString();
    let hour = timeString.substring(0, timeString.length - 2);
    let minute = timeString.substring(timeString.length - 2, timeString.length);

    if (time < 1000) return "0" + hour + ":" + minute;

    return hour + ":" + minute;
  };

  convertStringToTime = (time: string): number => {
    let timeString = time.replace(":", "");
    return parseInt(timeString);
  };

  incrementStartTime = (incr: number): void => {
    let timeNumber = this.convertStringToTime(this.state.startTime);
    let time = timeNumber + incr;

    if (time < 0) time = 2300;
    else if (time > 2359) time = 0;

    timeNumber = time;

    this.setState(() => ({
      startTime: this.convertTimeToString(timeNumber),
      endTime: this.state.endTime,
      confirmTimeFunc: this.state.confirmTimeFunc,
    }));
  };

  incrementEndTime = (incr: number): void => {
    let timeNumber = this.convertStringToTime(this.state.endTime);
    let time = timeNumber + incr;

    if (time < 0) time = 2300;
    else if (time > 2359) time = 0;

    timeNumber = time;

    this.setState(() => ({
      startTime: this.state.startTime,
      endTime: this.convertTimeToString(timeNumber),
      confirmTimeFunc: this.state.confirmTimeFunc,
    }));
  };

  render() {
    return (
      <div className="selection-hour-container">
        <div className="start-hour-container">
          I’m available from
          <div className="pseudo-button" onClick={() => this.incrementStartTime(-100)}>
            ◁
          </div>{" "}
          {this.state.startTime}
          <div className="pseudo-button" onClick={() => this.incrementStartTime(100)}>
            ▷
          </div>
        </div>
        <div className="end-hour-container">
          To
          <div className="pseudo-button" onClick={() => this.incrementEndTime(-100)}>
            ◁
          </div>{" "}
          {this.state.endTime}
          <div className="pseudo-button" onClick={() => this.incrementEndTime(100)}>
            ▷
          </div>
        </div>

        <div className="pseudo-button" onClick={this.state.confirmTimeFunc}>
          Confirm
        </div>
      </div>
    );
  }
}

interface TimeSlotComponentState extends TimeSlotInfo {
  showProposedTimeSlot: boolean;
  formData: {
    name: string;
    surname: string;
    email: string;
  };
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

  updateTimeslot = (updatedTimeslot: TimeSlotInfo): void => {
    this.setState({
      start_time: updatedTimeslot.start_time,
      end_time: updatedTimeslot.end_time,
    });
  };

  showTimeSlotForm = () => {
    this.setState({
      showProposedTimeSlot: true,
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
      <div className="selection-hour-container">
        <div className="start-hour-container">Start: {this.state.start_time}</div>
        <div className="end-hour-container">End: {this.state.end_time}</div>
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
}
