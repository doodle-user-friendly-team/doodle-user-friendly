import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardMedia, CardActions } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";

export default function Welcome() {
  const theme = useTheme();
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
        sx={{
          backgroundImage: "url('/sea.jpg')",
          bgcolor: "royalblue",
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
        <Box sx={{ backgroundImage: 'url("./sea.jpg")' }}>
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
      <div style={{ display: "flex" }}>
        {" "}
        {cardData.map((card) => (
          <Card
            key={card.id}
            sx={{
              marginTop: 10,
              width: "100%",
              direction: "row",
              alignItems: "center",

              ml: 5,
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
              <Link to={{ pathname: card.link, state: { customProp: news } }} sx={{ color: "teal" }}>
                <Button>create</Button>
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}
