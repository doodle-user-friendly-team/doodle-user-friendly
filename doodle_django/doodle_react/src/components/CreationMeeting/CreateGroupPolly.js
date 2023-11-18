import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import "./createGroupPolly.css";
import News from "./News";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import CreateGroup from "./CreateGroup.js";
import RangeDate from "../Date/RangeDate";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroupPolly = ({ news }) => {
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[600]),
    backgroundColor: grey[600],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const [error, setError] = useState(false);

  const [title, setTitle] = useState("");

  const updateTitle = (newTitle) => {
    setTitle(newTitle);
    if (newTitle !== "") setError(false);
  };

  const [description, setDescription] = useState("");

  const updateDescription = (newDescription) => {
    setDescription(newDescription);
  };

  const [location, setLocation] = useState("");

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  const [video, setVideo] = useState("Zoom");

  const updateVideo = (newVideo) => {
    setVideo(newVideo);
  };

  const [checked, setChecked] = React.useState(false);

  const updateCheck = (event) => {
    setChecked(event.target.checked);
  };

  let navigate = useNavigate();
  // console.log({ customer, title, subject, date });

  const getToken = () => sessionStorage.getItem("token");

  const titleError = () => {
    setError(true);
    const element = document.getElementById("title_form");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const checkRequirements = () => {
    if (title === "") {
      titleError();
      return false;
    }
    return true;
  };

  const deleteFields = () => {
    updateTitle("");
    setChecked(false);
    updateDescription("");
    updateLocation("");
    updateVideo("");
  };

  const handleApi = async (e) => {
    e.preventDefault();
    console.log("inside");
    let data = {
      title: title,
      description: description,
      location: location,
    };
    try {
      const result = axios.post(
        "http://127.0.0.1:8000/api/meetings/new/",
        data,
        {
          headers: {
            authorization: `Token ${getToken()}`,
          },
        }
      );
      alert("Mettting Created successfully !");
      navigate("/manage");
      deleteFields();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  const handleButtonClick = (e) => {
    if (checkRequirements()) handleApi(e);
  };

  const onExpand = (index) => {
    const btn = document.getElementsByClassName("field");
    if (index === 0) btn[0].style.marginBottom = "120px";
    else btn[1].style.paddingBottom = "180px";
  };

  console.log("news", news);

  const onContraction = (index) => {
    const btn = document.getElementsByClassName("field");
    if (index === 0) btn[0].style.marginBottom = "0px";
    else btn[1].style.paddingBottom = "0px";
  };

  return (
    <div className="CreateGroupPolly">
      <Grid container spacing={2}>
        <Grid className="sx_news" item xs={2}>
          <News news={news} start={0} numberOfDivsNews={3} />
        </Grid>
        <Grid className="middle_grid" item xs={8}>
          <div className="field">
            <CreateGroup
              title={title}
              setTitle={updateTitle}
              description={description}
              setDescription={updateDescription}
              location={location}
              setLocation={updateLocation}
              video={video}
              onContraction={onContraction}
              setVideo={updateVideo}
              checked={checked}
              setChecked={updateCheck}
              error={error}
              onExpand={onExpand}
            />
          </div>
          <div className="field">
            <RangeDate onExpand={onExpand} onContraction={onContraction} />
          </div>
          <div style={{ textAlign: "end" }}>
            <ColorButton
              style={{ margin: 20, textAlign: "end" }}
              onClick={handleButtonClick}
              variant="contained"
              type="submit"
            >
              Create Invate and Continue
            </ColorButton>
          </div>
        </Grid>
        <Grid className="dx_news" item xs={2}>
          <News news={news} start={3} numberOfDivsNews={6} />
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateGroupPolly;
