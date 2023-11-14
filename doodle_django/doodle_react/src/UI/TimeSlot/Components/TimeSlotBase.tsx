import React from "react";
import "../CSS/style.css";
import {TimeSlotComponent, TimeSlotFormComponent} from "./TimeSlotForm";

interface timeSlotInfo{
    startTime: string
    endTime: string
    id: string
}

interface state{
    creationMode: boolean
}
export class TimeSlotBaseComponent extends React.Component<{}, state> {
    
    constructor(props: {}) {
        super(props);
        this.state = {creationMode: false};
    }
    
    addNewTimeSlot = () => {
        this.setState(
            () => {
                return {creationMode: true};
            }
        )
    }
    
    
    
    getGetTimeSlots = (): timeSlotInfo[] => {
        let timeSlots : timeSlotInfo[] = [];
        
        timeSlots.push({startTime: "1630", endTime: "1730", id: "0"});
        
        return timeSlots;
    }

    pushToDatabase = (): void => {
        this.setState(
            () => {
                return {creationMode: false};
            }
        )
    }
    
    render()
    {
        return (
            <div className="timeslotPanel">
                <div className="buttonAdd">
                    <div className="group">
                        <div className="overlap-group">
                            <div className="text-wrapper" onClick={() => this.addNewTimeSlot()}>+
                            </div>
                        </div>
                    </div>
                </div>
                <div className="timeSlotContainer">
                    {
                        this.getGetTimeSlots().map((timeSlot) => {
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
};

