import React from "react";
import axios from 'axios';
import "../CSS/style.css";
import {TimeSlotComponent, TimeSlotFormComponent} from "./TimeSlotForm";

interface timeSlotInfo{
    id: string
    start_time: string
    end_time: string
    user: string
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
    
    _array: timeSlotInfo[] = [];

    
    getGetTimeSlots =  (creationMode: boolean): void => {
            axios.get('http://localhost:8000/timeslots/').then((response: { data: timeSlotInfo[]; }) =>{

                this._array = response.data.map((x) => x);
                this.setState(() => {
                    return {creationMode: creationMode, timeSlots: this._array }
                })
            })
    };

    
    pushToDatabase = (): void => {
        
        this.getGetTimeSlots(false)
    }

    render() {
        console.log(this.state.timeSlots)
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
                            this.state.timeSlots.map((ts) => {
                                return <TimeSlotComponent id={ts.id} start_time={ts.start_time} end_time={ts.end_time} user={ts.user}/>
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
