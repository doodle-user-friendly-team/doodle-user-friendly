//npm install react-google-calendar-api
//npm install react-google-button

import axios from "axios";
import React, { SyntheticEvent } from "react";
import ApiCalendar from "react-google-calendar-api";

const API_KEY = 'AIzaSyCBxhy31cz77yTV8mEuImvpY7Y4M_cyHTM'; 
const CLIENT_ID = '343295916116-2g1jijfc6kkt3mlnmaess7cp7aeu928e.apps.googleusercontent.com';

const config = {
    clientId: CLIENT_ID,
    apiKey: API_KEY,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  };

export const apiCalendar = new ApiCalendar(config);

export function handleAuthClick() {
  apiCalendar.handleAuthClick().then((result: any) => {
    console.log(result);

    //get user info
    
    /*axios.post('https://www.googleapis.com/plus/v1/people/me?access_token=' + result.access_token).
    then((response) => {
      console.log(response);
    })*/

    
  }).catch((error: any) => {
    console.log(error);
  });

}

export function handleSignoutClick() {
  apiCalendar.handleSignoutClick();
}

// insertEvent(new Date().toISOString(), new Date().toISOString(), "ciao da react", "hahahaha", "Tropea")
export function insertEvent(start: string, end: string, title: string, description: string, location: string) {

  //TODO: prendi un calendario alido non casuale
    apiCalendar.listCalendars().then(({result}: any) => {
        console.log(result.items);
        apiCalendar.setCalendar(result.items[3]['id'])

        apiCalendar.createEvent({
          start: {
            dateTime: start,
            timeZone: result.items[3]['timeZone']
            },
            end: {
              dateTime: end,
              timeZone: result.items[3]['timeZone']
              }
              }).then((result: any) => {
                console.log(result);

                apiCalendar.updateEvent({summary: title, description: description, location: location}, 
                    result.result.id).then((result: any) => {

                }).catch((error: any) => {
                  console.log(error);
                })

              }).catch((error: any) => {
                console.log(error);
              })
      });
    

    
}