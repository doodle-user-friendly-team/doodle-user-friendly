import React from "react";
import "../CSS/style.css";

export const CalendarBarComponent = (props: {month: string; year: string;}) => {
    return (
        <div className="box">
            <div className="anni">
                <div className="overlap-group">
                    <img className="polygon" alt="Polygon" src="polygon-3.svg" />
                    <img className="img" alt="Polygon" src="polygon-4.svg" />
                    <div className="text-wrapper">{props.year}</div>
                </div>
            </div>
            <div className="mesi">
                <div className="overlap-group">
                    <img className="polygon" alt="Polygon" src="polygon-3.svg" />
                    <img className="img" alt="Polygon" src="polygon-4.svg" />
                    <div className="text-wrapper">{props.month}</div>
                </div>
            </div>
    </div>
    );
};
