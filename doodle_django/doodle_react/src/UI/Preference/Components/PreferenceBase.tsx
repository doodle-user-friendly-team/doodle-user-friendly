import React from "react";
import axios from "axios";
import "../CSS/style.css";
import {PreferenceComponent} from "./PreferenceComponent";
import {Button} from "@mui/material";


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
}

interface preferenceBaseProps{
    newData: string
}

export class PreferenceBaseComponent extends React.Component< preferenceBaseProps, state> {

    _array : preferenceInfo[] = []

    constructor(props: preferenceBaseProps) {
        super(props);
        this.state = {newData: props.newData, creationMode: false, preferences: []};
    }

    handleCreationForm = () => {
        console.log("ciao")
    };

    getTimeSlotPreferences = (creationMode: boolean, time_slot_id: string): void => {
        axios.get(`http://localhost:8000/votes/${time_slot_id}/`).then((response: { data: preferenceInfo[]; }) =>{

            this._array = response.data.map((x) => x);
            console.log(response.data)
            this.setState(() => {
                return {newData: this.props.newData, creationMode: creationMode, preferences: this._array }
            })
        })
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
            </div>

        );
    }

    componentDidUpdate(){
        if (this.props.newData !== this.state.newData) {

            this.getTimeSlotPreferences(false, this.props.newData)
        }
    }

}