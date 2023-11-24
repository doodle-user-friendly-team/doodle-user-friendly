import * as React from "react";
import { grey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Select, { components } from "react-select";
import { alpha, styled } from "@mui/material/styles";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: grey[600],
    "&:hover": {
      backgroundColor: alpha(grey[900], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: grey[900],
  },
}));

const options = [
  { value: "Zoom", label: "Zoom", icon: "images/zoom.png" },
  { value: "GoogleMeet", label: "Google Meet", icon: "images/meet.png" },
  {
    value: "MicrosoftTeams",
    label: "Microsoft Teams",
    icon: "images/teams.png",
  },
];

const { SingleValue, Option } = components;
const IconOption = (props) => (
  <Option {...props}>
    <img
      src={require("../" + props.data.icon)}
      style={{ width: 16, marginBottom: -2 }}
      alt={props.data.label}
    />
    <nobr
      style={{
        marginLeft: 5,
        marginTop: "auto",
        marginBottom: "auto",
      }}>
      {props.data.label}
    </nobr>
  </Option>
);

const IconSingleValue = (props) => (
  <SingleValue {...props}>
    <img
      src={require("../" + props.data.icon)}
      style={{ width: 16, marginBottom: -2 }}
      alt={props.data.label}
    />
    <nobr style={{ marginLeft: 5, color: "#757575" }}>{props.data.label}</nobr>
  </SingleValue>
);

const SwitchSelect = ({
  checked,
  setChecked,
  setVideo,
  onExpand,
  onContraction,
}) => {
  const handleVideoChange = (selectedOption) => {
    setVideo(selectedOption.value);
  };

  return (
    <div className="switch">
      <FormControlLabel
        control={<PinkSwitch checked={checked} onChange={setChecked} />}
        label="Video conferencing"
      />
      {checked === true && (
        <Select
          img
          defaultValue={options[0]}
          options={options}
          onMenuOpen={() => onExpand(0)}
          onMenuClose={() => onContraction(0)}
          onChange={handleVideoChange}
          components={{ SingleValue: IconSingleValue, Option: IconOption }}
        />
      )}
    </div>
  );
};

export default SwitchSelect;
