import React from "react";
import axios from "axios";
import "../CSS/style.css";
import {PreferenceComponent} from "./PreferenceComponent";
import {timeSlotInfo} from "../../TimeSlot/Components/TimeSlotBase";
import {Button} from "@mui/material";
import {CreatePreferenceForm} from "./CreatePreferenceForm";
import Cookies from "js-cookie";


export interface fakeUser{
    id: string,
    name: string,
    surname: string,
    email: string
}

export interface createPreference{
    preference: string,
    time_slot: string,
    user: string
}

export interface preferenceInfo{
    id: string,
    preference: string,
    time_slot: string,
    user: fakeUser
}


interface state{
    newData: string
    creationMode: boolean
    preferences: preferenceInfo[]
    timeSlot: timeSlotInfo
}

interface preferenceBaseProps{
    newData: string
}

export class PreferenceBaseComponent extends React.Component< preferenceBaseProps, state> {

    _array : preferenceInfo[] = []
    _timeSlot: timeSlotInfo = {id: "", start_time: "", end_time: ""}

    constructor(props: preferenceBaseProps) {
        super(props);
        this.state = {newData: props.newData, creationMode: false, preferences: [], timeSlot: {id: "", start_time: "", end_time: ""}};
    }

    handleCreationForm = () => {
        this.setState(
            () => {
                return {creationMode: true, preferences: this.state.preferences, timeSlot: this.state.timeSlot};
            }

        )
    };

    getTimeSlot =  (creationMode: boolean, time_slot_id: string): void => {
        axios.get(`http://localhost:8000/timeslots/id/${time_slot_id}/`).then((response: { data: timeSlotInfo; }) =>{

            this._timeSlot = response.data;
            console.log(response.data)
            console.log(this._timeSlot)
            this.setState(() => {
                return {newData: this.props.newData, creationMode: creationMode, preferences: this._array, timeSlot: this._timeSlot }
            })
        })
    }

    getTimeSlotPreferences = (creationMode: boolean, time_slot_id: string): void => {
        axios.get(`http://localhost:8000/votes/timeslot/${time_slot_id}/`).then((response: { data: preferenceInfo[]; }) =>{

            this._array = response.data.map((x) => x);
            console.log(response.data)
            this.setState(() => {
                return {newData: this.props.newData, creationMode: creationMode, preferences: this._array, timeSlot: this._timeSlot }
            })
        })
    }

    addNewPreference =(preference: string) => {

        const postData = {
            preference: preference,
            time_slot: this.state.timeSlot.id,
            user: 1
        };

        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        };


        axios.post('http://localhost:8000/votes/', postData, { headers })
            .then((response) => {
                console.log("res:" + response);
                let saved_preference: preferenceInfo = response.data
                saved_preference.user = {id: "1", name: Cookies.get("name")!!, surname: Cookies.get("surname")!!, email: Cookies.get("email")!!}
                this.state.preferences.push(response.data)
                this.setState(
                    () => {
                        return {creationMode: false, preferences: this.state.preferences, timeSlot: this.state.timeSlot};
                    }

                )
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleCloseForm = () => {
        this.setState(
            () => {
                return {creationMode: false, preferences: this.state.preferences, timeSlot: this.state.timeSlot};
            }

        )
    }

    render() {

        return (

            <div className="preferencePanel">
                <div className="header">
                    <span>Scritta all'inizio</span>
                    <button className="add-button" onClick={this.handleCreationForm}>Crea</button>
                </div>
                <div className="preferenceContainer">
                    {
                        this.state.preferences.map((p) => {
                            return <PreferenceComponent id={p.id} preference={p.preference} time_slot={p.time_slot} user={p.user}/>
                        })
                    }
                </div>
                <div className="preferenceCreateForm">
                    {
                        this.state.creationMode && <CreatePreferenceForm  onSave={this.addNewPreference} onClose={this.handleCloseForm} start={this.state.timeSlot.start_time} end={this.state.timeSlot.end_time} />
                    }
                </div>
            </div>

        );
    }

    componentDidUpdate(){
        console.log("ciaciacoacia")
        if (this.props.newData !== this.state.newData) {
            console.log("sono entrato")
            this.getTimeSlot(false, this.props.newData)
            this.getTimeSlotPreferences(false, this.props.newData)
        }
    }

}