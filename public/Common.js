const lineChart = (data) => {
  Highcharts.chart("container", {
    credits: {
      enabled: false,
    },
    chart: {
      type: "spline",
    },
    title: {
      text: "Live data from Unified Hosting Service",
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
        text: "Value (kW)",
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
    colors: ["#6CF", "#39F", "#06C", "#036", "#000"],
    series: data,
  });
};
const getTopicValURL = "/gettopicvalues";
const postTopicsURL = "/topics";

function plotValues() {
  try {
    var sigList = [];
    $("input:checkbox[name=type]:checked").each(function () {
      sigList.push($(this).val());
    });
    console.log(sigList);
    sendTopicList(postTopicsURL, sigList.join(";"));
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

async function getTopicValues() {
  let response = await fetch(`${getTopicValURL}`);
  let data = await response.json();
  console.log(data);
  lineChart(data);
}

setInterval(getTopicValues, 5000);
