import React, {useEffect} from "react";
import axios from 'axios';
import "../CSS/style.css";
import {TimeSlotComponent, TimeSlotFormComponent} from "./TimeSlotForm";
import Cookies from "js-cookie";

interface timeSlotInfo{
    id: string
    start_time: string
    end_time: string
}

interface state{
    newData: string
    creationMode: boolean
    timeSlots: timeSlotInfo[]
}

interface timeSlotBaseProps{
    newData: string
    updateNewData:  (val: string) => void
}

export class TimeSlotBaseComponent extends React.Component<timeSlotBaseProps , state> {
    
    constructor(props: timeSlotBaseProps) {
        super(props);
        this.state = {newData: props.newData, creationMode: false, timeSlots: []};
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
        
            const day = this.props.newData.substring(0, 2);
            const month = this.props.newData.substring(3, 5);
            const year = this.props.newData.substring(6, 10);
            
            axios.get('http://localhost:8000/timeslots/?day=' + day + "&month=" + month + "&year=" + year).then((response: { data: timeSlotInfo[]; }) =>{

                this._array = response.data.map((x) => x);
                this.setState(() => {
                    return {newData: this.props.newData, creationMode: creationMode, timeSlots: this._array }
                })
                this.setState({timeSlots: this._array, newData: this.props.newData})
            })
    };

    
    pushToDatabase = (): void => {
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
                            this.state.timeSlots.map((ts) => {
                                return <TimeSlotComponent id={ts.id} start_time={ts.start_time} end_time={ts.end_time}/>
                            })
                        }
                    <div className="timeSlotFormContainer">
                        {this.state.creationMode && <TimeSlotFormComponent confirmTimeFunc={this.pushToDatabase} dataSelected={this.state.newData}/>}
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(){
        if (this.props.newData !== this.state.newData) {
            this.getGetTimeSlots(false)
        }
    }

}

