const axios = require("axios");

const baseURL = "http://10.246.0.10:1883/";
const header = {
  Authorization:
    "Bearer f44a7c6a-219f-417d-9a1d-f2bafd38ad53:gepc-subs:14d1b530",
};
const orderby = "asc";
const limit = 20;

function formattedHistData(resData) {
  var data = [];
  if (resData.length > 0) {
    resData.forEach((e) => {
      var date = new Date(e.timestamp);
      data.push([
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ),
        e.value,
      ]);
    });
    return data;
  } else {
    return data;
  }
}

function getHistoricalValues(req) {
  axios
    .get(`${baseURL}${req.topic}`, {
      headers: header,
      params: {
        timefrom: req.timefrom,
        timeto: req.timeto,
        orderby: orderby,
        limit: limit,
      },
    })
    .then((response) => {
      console.log(response.data);
      var resData = JSON.parse(response.data);
      var dataArr = formattedHistData(resData);
      var data = [{ name: req.topic, data: dataArr }];
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = getHistoricalValues;
