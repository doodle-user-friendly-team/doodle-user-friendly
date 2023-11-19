import * as React from "react";
import {
  Container,
  Tabs,
  Tab,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardActionArea,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { start } from "repl";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ContainerTopThree } from "./TopThreeTimeSlot";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function UserRecap() {
  return (
      <UserRecapBox />
  );
}

function UserRecapBox() {
  const preferencesData = [
    { date: "2023-11-11", start: "03:00 PM", end: "05:00 PM", preference: 1 },
    { date: "2023-11-12", start: "10:00 AM", end: "12:00 AM", preference: 0 },
    { date: "2023-11-12", start: "10:00 AM", end: "12:00 AM", preference: 2 },
    { date: "2023-11-12", start: "10:00 AM", end: "12:00 AM", preference: 2 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 1 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 1 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 1 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 0 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 1 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 2 },
    { date: "2023-11-11", start: "02:00 PM", end: "04:00 PM", preference: 1 },
  ];

  const listPreferences = preferencesData.map((preferencesData) => (
    <Card sx={{ width: 250, margin: "10px" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          {preferencesData.date}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {preferencesData.start} - {preferencesData.end}
        </Typography>

        {preferencesData.preference === 0 ? (
          <Button color="success">
            <Typography variant="subtitle1">Available</Typography>
          </Button>
        ) : preferencesData.preference === 1 ? (
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
  ));

  return (
    <Container>
      <Typography variant="h4" align="center" marginBottom={5} gutterBottom>
        Your preferences
      </Typography>
<div style={{height:'500px', overflowY:'scroll'}}>

      {preferencesData.length === 0 ? (
        <Typography variant="h6" align="center">
          Nessun Time slot disponibile al momento.
        </Typography>
      ) : (
        <Grid2
          container
          spacing={3}
          justifyContent={"space-evenly"}
          alignItems={"flex-start"}
        >
          {listPreferences}
        </Grid2>
      )}
</div>
    </Container>
  );
}
