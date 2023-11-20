import { Container, Divider, Slider, Stack } from "@mui/material";
import { ContainerTopThree } from "./TopThreeTimeSlot";
import { UserRecap } from "./UserRecap";

export function Recap() {
  return (
    <Container sx={{ margin: "20px", textAlign:'center'}}>
      <Stack spacing={8}>
        <ContainerTopThree />
        <Divider />
            <UserRecap user_id={1} meeting_id={1}/>
      </Stack>
    </Container>
  );
}
