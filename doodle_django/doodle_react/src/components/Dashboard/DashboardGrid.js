import Grid from "@mui/material/Grid";
import MeetingsCreation from "./MeetingsCreation";

const DashboardGrid = ({ data }) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid className="sx_news" item xs={2}></Grid>
        <Grid item xs={8}>
          <MeetingsCreation data={data} />
        </Grid>
        <Grid className="dx_news" item xs={2}></Grid>
      </Grid>
    </div>
  );
};

export default DashboardGrid;
