const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
var mqttclient = require("./mqttclient");
const app = express();
const port = 3001;

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

var mqttClnt = new mqttclient();
mqttClnt.connect();
var oldTopics = [];

app.post("/topics", function (req, res) {
  var topics = req.body.topicList.split(";");
  if (topics.length > 0) {
    if (oldTopics.length === 0) {
      oldTopics = topics;
    } else {
      mqttClnt.unsubscribeToData(oldTopics);
    }
    mqttClnt.subscribeToData(topics);
  }
  console.log(topics);
});

app.get("/gettopicvalues", function (req, res) {
  var mqttData = mqttClnt.getData();
  //console.log(mqttData);
  res.send(mqttData);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
