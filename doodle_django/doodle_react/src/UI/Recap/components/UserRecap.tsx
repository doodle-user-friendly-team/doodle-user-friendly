import * as React from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export function UserRecap(props: UserRecapProps) {
  return <UserRecapBox user_id={props.user_id} meeting_id={props.meeting_id} />;
}

interface UserRecapProps {
  user_id: number;
  meeting_id: number;
}

interface VoteInfo {
  vote_id: number;
  user: number;
  time_slot: TimeSlotInfo;
  preference: string;
}

interface TimeSlotInfo {
  id: string;
  start_time: string;
  end_date: string;
  schedule_pool: number;
  user: number;
}

interface state {
  gotData: boolean,
  preferencesData: VoteInfo[]
}

class UserRecapBox extends React.Component<{user_id: number, meeting_id: number}, state> {
  constructor(props: UserRecapProps) {
    super(props);
    this.state = {gotData: false, preferencesData: []};
    axios
    .post("http://localhost:8000/api/meeting/recap/", {
      user: props.user_id,
      meeting: props.meeting_id,
    })
    .then((response: { data: VoteInfo[] }) => {
      this.setState(
        () => {
          return {gotData: true, preferencesData: response.data}
        }
      );
      console.log(this.state.preferencesData);
    });
  }
  

  render() { return (
    <Container>
      <Typography variant="h4" align="center" marginBottom={5} gutterBottom>
        Your preferences
      </Typography>
      <div style={{ height: "500px", overflowY: "scroll" }}>
        {!this.state.gotData ? (
          <Typography variant="h6" align="center">
            You haven't put any preference in timeslots.
          </Typography>
        ) : (
          <ListPreferences preferencesData={this.state.preferencesData} />
        )}
      </div>
    </Container>
  );}
}

interface ListPreferencesProps {
  preferencesData: VoteInfo[];
}

function ListPreferences(props: ListPreferencesProps) {
  return (
    <Grid2
      container
      spacing={3}
      justifyContent={"space-evenly"}
      alignItems={"flex-start"}
    >
      {props.preferencesData.map((value: VoteInfo) => (
        <Card sx={{ width: 250, margin: "10px" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h5" color="text.primary" gutterBottom>
              {value.time_slot.start_time.split("T")[0]}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {value.time_slot.start_time.split("T")[1].split("Z")[0]} - {value.time_slot.end_date.split("T")[1].split("Z")[0]}
            </Typography>

            {value.preference === "Available" ? (
              <Button color="success">
                <Typography variant="subtitle1">Available</Typography>
              </Button>
            ) : value.preference === "Unavailable" ? (
              <Button color="error">
                <Typography variant="subtitle1">Not available</Typography>
              </Button>
            ) : (
              <Button color="secondary">
                <Typography variant="subtitle1">Unsure</Typography>
              </Button>
            )}
          </CardContent>
          <CardActions>
            <IconButton size="medium" aria-label="Modify preference">
              <CreateIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Grid2>
  );
}
