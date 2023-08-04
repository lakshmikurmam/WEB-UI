const axios = require("axios");

const baseURL = "http://10.246.0.10:8083/api/timeseriesdata/";
const header = {
  Authorization:
    "Bearer f44a7c6a-219f-417d-9a1d-f2bafd38ad53:gepc-subs:14d1b530",
};
const orderby = "asc";
const limit = 20;

async function formattedHistData(resData) {
  try {
    var data = [];
    if (resData.length > 0) {
      resData.forEach((e) => {
        var date = new Date(e.timeStamp);
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
  } catch (err) {
    console.log(err);
  }
}

async function getHistoricalValues(req) {
  let data = [];
  try {
    let response = await axios.get(`${baseURL}${req.topic}`, {
      headers: header,
      params: {
        timefrom: req.timefrom,
        timeto: req.timeto,
        orderby: orderby,
        limit: limit,
      },
    });
    let dataArr = await formattedHistData(response.data);
    data.push({ name: req.topic, data: dataArr });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return data;
  }
}

module.exports = getHistoricalValues;
