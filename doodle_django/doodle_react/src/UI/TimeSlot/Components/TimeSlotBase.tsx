import React from "react";
import axios from 'axios';
import "../CSS/style.css";
import {TimeSlotComponent, TimeSlotFormComponent} from "./TimeSlotForm";

interface timeSlotInfo{
    id: string
    startTime: string
    endTime: string
}

interface state{
    creationMode: boolean
    timeSlots: timeSlotInfo[]
    
}
export class TimeSlotBaseComponent extends React.Component<{}, state> {
    
    constructor(props: {}) {
        super(props);
        this.state = {creationMode: false, timeSlots: []};
    }
    
    addNewTimeSlot = () => {
        this.setState(
            () => {
                return {creationMode: true, timeSlots: this.state.timeSlots};
            }
        )
    }



    getGetTimeSlots =  (creationMode: boolean): void => {
            axios.get('http://localhost:8000/timeslots/').then((response: { data: timeSlotInfo[]; }) =>{
                console.log(response.data)
                this.setState(() => {
                    return {creationMode: creationMode, timeSlots: response.data}
                })
            })
    };


    pushToDatabase = (): void => {
        this.getGetTimeSlots(false)
    }

    render() {
        return (
            <div className="timeslotPanel">
                <div className="buttonAdd">
                    <div className="group">
                        <div className="overlap-group">
                            <div className="text-wrapper" onClick={() => this.addNewTimeSlot()}>+</div>
                        </div>
                    </div>
                </div>
                <div className="timeSlotContainer">
                        {
                            this.state.timeSlots.map((timeSlot) => {
                                return <TimeSlotComponent startTime={timeSlot.startTime} endTime={timeSlot.endTime}/>
                            })
                        }
                    <div className="timeSlotFormContainer">
                        {this.state.creationMode && <TimeSlotFormComponent confirmTimeFunc={this.pushToDatabase}/>}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getGetTimeSlots(false)
    }

}

