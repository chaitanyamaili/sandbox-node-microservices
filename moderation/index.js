const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type == "CommentCreated") {
    console.log(data.content);
    const status = data.content.includes("orange") ? "rejected" : "approved";
    console.log(status);

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status: status,
        content: data.content,
      },
    });

    // Send the response.
    res.send({ status: "ok" });
  }
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
