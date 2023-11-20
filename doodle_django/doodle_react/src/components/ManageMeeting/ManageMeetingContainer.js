import Grid from "@mui/material/Grid";
import { useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import "../CreationMeeting/createGroup.css";
import "../CreationMeeting/createGroupPolly.css";
import "../ManageMeeting/manage.css";
import ManageMeeting from "../ManageMeeting/ManageMeeting";
import News from "../CreationMeeting/News";
import TableMeeting from "../ManageMeeting/TableMeeting";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import axios from "axios";

const Manage = ({ news, data }) => {
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[600]),
    backgroundColor: grey[600],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const getToken = () => sessionStorage.getItem("token");

  const submitForm = () => {
    alert("See you in the next sprint!");
    return;
    console.log("id ", data["id"], selectedColumn);
    let d = {
      id: data["id"],
      time_slots: selectedColumn,
    };
    try {
      const result = axios.post("meeting/" + data["id"] + "/book/", d, {
        headers: {
          authorization: `Token ${getToken()}`,
        },
      });
      alert("Mettting Booked !");
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const [selectedColumn, setSelectedColumn] = useState([]);

  const columnSelection = (columnName) => {
    if (columnName !== 0) {
      if (selectedColumn === columnName) {
        setSelectedColumn("");
      } else {
        setSelectedColumn(columnName);
      }
    }
  };

  return (
    <div className="CreateGroup">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid className="sx_news" item xs={2}>
            <News news={news} start={0} numberOfDivsNews={3} />
          </Grid>
          <Grid style={{ marginTop: 32, paddingLeft: 0 }} item xs={8}>
            <div className="field">
              <ManageMeeting data={data} />
              <TableMeeting
                data={data}
                selectedColumn={selectedColumn}
                columnSelection={columnSelection}
              />
              <div style={{ textAlign: "end" }}>
                <ColorButton
                  style={{ margin: 20, textAlign: "end" }}
                  onClick={submitForm}
                  variant="contained">
                  Book it
                </ColorButton>
              </div>
            </div>
          </Grid>
          <Grid className="dx_news" item xs={2}>
            <News news={news} start={3} numberOfDivsNews={6} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Manage;
