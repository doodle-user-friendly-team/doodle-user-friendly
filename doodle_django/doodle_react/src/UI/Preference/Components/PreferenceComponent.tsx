import React from "react";
import {preferenceInfo} from "./PreferenceBase";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import CreateIcon from '@mui/icons-material/Create';
import "../CSS/style.css";
import {Button} from "@mui/material";
import { useState } from "react";
import { fakeUser } from "./PreferenceBase";
import { MofifyPreferenceForm } from "./ModifyPreferenceForm";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

interface detailPreference{
    id: string,
    preference: string,
    time_slot: string,
    user:  fakeUser,
    start_time: string,
    end_time: string,
    date: string
}

interface state{
    preference: string,
    user: fakeUser,
    id: string,
    time_slot: string,
    start_time: string,
    end_time: string,
    date: string
    showForm: boolean
}

export class PreferenceComponent extends React.Component<detailPreference, state> {


    constructor(props: detailPreference) {
        super(props);
        this.state = {preference: props.preference, user: props.user, id: props.id, time_slot: props.time_slot, start_time: props.start_time, end_time: props.end_time, date: props.date, showForm: false};
    }

    handleModifyForm = () => {
        console.log("ciao")
    }

    setForm = (show: boolean) => {
        this.setState( () => {
            return {preference: this.state.preference, user: this.state.user, id: this.state.id, time_slot: this.state.time_slot, start_time: this.state.start_time, end_time: this.state.end_time, date: this.state.date, showForm: show}
        })
    }

    render() {


        let icon;

        switch (this.state.preference) {
            case 'Unavailable':
                icon = <CloseIcon color="error"/>
                break;
            case 'Maybe available':
                icon = <QuestionMarkIcon color="warning"/>
                break;
            case "Available":
                icon = <DoneIcon color="success"/>
                break;

        }
        return (

            <div className="card">
                <div>
                    <div className="name">{this.state.user.name + " " + this.state.user.surname}</div>
                </div>
                {icon}
                <Button className="modify-button" startIcon={<CreateIcon />} onClick={()=>this.setForm(true)}></Button>
                <div>
                {this.state.showForm && <MofifyPreferenceForm 
                    id={parseInt(this.state.id)}
                    time_slot={parseInt(this.state.time_slot)}
                    selectedPreference={this.state.preference} 
                    onClose={() => this.setForm(false)} 
                    start={this.state.start_time} 
                    end={this.state.end_time}
                    date={this.state.date}
                />}
                </div>
            </div>
        )
    }
}
