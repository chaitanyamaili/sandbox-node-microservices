const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  const data = {
    id,
    title,
  };

  posts[id] = data;

  // emit an event to event-bus
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: data,
  });

  // send the response to the client.
  res.status(201).send(posts[id]);
});

// Receive event,
app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);

  res.send({ status: "Ok" });
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
