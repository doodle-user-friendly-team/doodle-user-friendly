import React from "react";
import {preferenceInfo} from "./PreferenceBase";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import CreateIcon from '@mui/icons-material/Create';
import "../CSS/style.css";
import {Button} from "@mui/material";


export class PreferenceComponent extends React.Component<preferenceInfo, preferenceInfo> {


    constructor(props: preferenceInfo) {
        super(props);
        this.state = this.props;
    }

    handleModifyForm = () => {
        console.log("ciao")
    }


    render() {
        let icon;

        switch (this.state.preference) {
            case 'non ci sono':
                icon = <CloseIcon color="error"/>
                break;
            case 'non lo so':
                icon = <WarningIcon color="warning"/>
                break;
            case "ci sono":
                icon = <DoneIcon color="success"/>
                break;

        }
        return (

            <div className="card">
                <div>
                    <div className="name">{this.state.user.name + " " + this.state.user.surname}</div>
                </div>
                {icon}
                <Button className="modify-button" startIcon={<CreateIcon />} onClick={
                    () => {
                        console.log(this.state)
                    }
                }></Button>
            </div>
        )
    }
}
