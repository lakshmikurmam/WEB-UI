const lineChart = (data) => {
  Highcharts.chart("container", {
    credits: {
      enabled: false,
    },
    chart: {
      type: "spline",
    },
    title: {
      text: "Live Data from UHS - MQTT",
    },
    subtitle: {
      text: "Data may receive in irregular time intervals",
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%e. %b",
        year: "%b",
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Values",
      },
      min: 0,
    },
    tooltip: {
      headerFormat: "<b>{series.name}</b><br>",
      pointFormat: "{point.x:%e. %b}: {point.y:.2f} m",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 2.5,
        },
      },
    },
    series: data,
  });
};
const lineChart2 = (data) => {
  Highcharts.chart("containerRestAPI", {
    credits: {
      enabled: false,
    },
    chart: {
      type: "spline",
    },
    title: {
      text: "Historical data from UHS - RestAPI",
    },
    subtitle: {
      text: "Data within the selected range",
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%e. %b",
        year: "%b",
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Values",
      },
      min: 0,
    },
    tooltip: {
      headerFormat: "<b>{series.name}</b><br>",
      pointFormat: "{point.x:%e. %b}: {point.y:.2f} m",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 2.5,
        },
      },
    },
    series: data,
  });
};
const getTopicValURL = "/gettopicvalues";
const postTopicsURL = "/topics";
const getHistTopicValURL = "/gethistvalues";

$(function () {
  $("#fromDateInput").datepicker({ dateFormat: "yy-mm-dd" });
});

$(function () {
  $("#toDateInput").datepicker({ dateFormat: "yy-mm-dd" });
});

function plotHistValues() {
  try {
    var signame = "";
    $("input:radio[name=type]:checked").each(function () {
      signame = $(this).val();
    });
    console.log(signame);
    var fromDate = document.getElementById("fromDateInput").value;
    var toDate = document.getElementById("toDateInput").value;
    console.log(signame + " " + fromDate + " " + toDate);
    if (signame === "") {
      alert("Please select the topic to get Historical data.");
      return;
    } else if (fromDate === "") {
      alert("Please input the From Date to get Historical data.");
      return;
    } else if (toDate === "") {
      alert("Please input the To Date to get Historical data.");
      return;
    } else {
      getHistValues(signame, fromDate, toDate);
    }
  } catch (err) {
    console.log(err);
  }
}

function plotValues() {
  try {
    var sigList = [];
    $("input:checkbox[name=type]:checked").each(function () {
      sigList.push($(this).val());
    });
    console.log(sigList);
    sendTopicList(postTopicsURL, sigList.join(";"));
    getTopicValues();
  } catch (err) {
    console.log(err);
  }
}

async function sendTopicList(url = "", topicList) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topicList: topicList,
    }),
  });
}

async function getHistValues(topic, fromDate, toDate) {
  let response = await fetch(`${getHistTopicValURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: topic,
      timefrom: fromDate,
      timeto: toDate,
    }),
  });
  let data = await response.json();
  //console.log(data);
  lineChart2(data);
}

async function getTopicValues() {
  let response = await fetch(`${getTopicValURL}`);
  let data = await response.json();
  //console.log(data);
  lineChart(data);
}

setInterval(getTopicValues, 5000);
