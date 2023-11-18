import {
  Card,
  Box,
  Typography,
  CardContent,
  Button,
  CardActionArea,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";

function Welcome() {
  const cardData = [
    {
      id: "1",
      title: "Group poll",
      content: "choose your times",
      link: "/create",
    },
    { id: "2", title: "1:1", content: "ask one on one", link: "/" },
    {
      id: "3",
      title: "Booking Page",
      content: "book group poll",
      link: "/create",
    },
  ];

  return (
    <div>
      <Card
        className="welcome"
        sx={{
          //   bgcolor: "rgb(167, 178, 187)",
          background:
            "linear-gradient(-45deg, #73d3b6f3, #65d4e7de, #67a9e79a, #cc9ee7)",
          alignSelf: "center",
          justifyContent: "center",
          marginTop: 5,
          display: "flex",
          alignItems: "center",
          width: 800,
          height: 200,
          ml: 30,
        }}
      >
        <Box className="box">
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h4">
              Welcome to Doodle Unical
            </Typography>
            <Typography variant="h4" color="text.secondary" component="div">
              User
            </Typography>
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
          ></Box>
        </Box>
      </Card>
      <div className="card" style={{ display: "flex" }}>
        {" "}
        {cardData.map((card) => (
          <Card
            className="cards"
            key={card.id}
            sx={{
              marginTop: 10,
              width: "100%",
              direction: "row",
              alignItems: "center",
              bgcolor: "rgb(167, 178, 187)",
              ml: 5,
              mr: 10,
            }}
          >
            <CardActionArea>
              <Typography variant="h4">{card.title}</Typography>
            </CardActionArea>
            <CardActionArea>
              <Typography variant="h6" sx={{ marginTop: 5 }}>
                {card.content}
              </Typography>
            </CardActionArea>
            <CardActions style={{ justifyContent: "center" }}>
              <Link to={card.link} sx={{ color: "teal" }}>
                <Button>create</Button>
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Welcome;
