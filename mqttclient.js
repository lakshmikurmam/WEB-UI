const mqtt = require("mqtt");

class MqttClient {
  constructor() {
    this.hcdata = [];
    this.client = null;
    this.username = "gepc-subs";
    this.password = "14d1b530";
    this.clientId = "f44a7c6a-219f-417d-9a1d-f2bafd38ad53";
    this.host = "10.246.0.10:1883";
  }

  connect() {
    this.client = mqtt.connect(
      `mqtt://${this.username}:${this.password}@${this.host}`,
      {
        clientId: this.clientId,
        clean: true,
        rejectUnauthorized: false,
        connectTimeout: 30 * 1000,
        keepalive: 60,
      }
    );

    this.client.on("error", (err) => {
      console.log(err);
      this.client.end();
    });

    this.client.on("connect", () => {
      console.log("Client connected successfully");
    });

    // TODO: check if reconnect event is required
    //this.client.on("", () => {});

    this.client.on("message", (topic, message) => {
      try {
        var val = JSON.parse(message); // assumed message is in string format
        var date = new Date(val.timestamp);
        var dateUTC = Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        );
        if (this.hcdata.length === 0) {
          var val = { name: topic, data: [[dateUTC, val.value]] };
          this.hcdata.push(val);
        } else {
          var isPresent = false;
          for (let i = 0; i < this.hcdata.length; i++) {
            if (this.hcdata[i]["name"] === topic) {
              this.hcdata[i]["data"].push([dateUTC, val.value]);
              isPresent = true;
              break;
            }
          }
          if (!isPresent) {
            var val = {
              name: topic,
              data: [[dateUTC, val.value]],
            };
            this.hcdata.push(val);
          }
        }
        console.log(`Topic=${topic}, Message=${message}`);
      } catch (err) {
        console.log(err);
      }
    });

    this.client.on("close", () => {
      console.log(`Client disconnected successfully.`);
    });
  }

  subscribeToData(topic) {
    try {
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
        } else {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  unsubscribeToData(topic) {
    try {
      this.client.unsubscribe(topic, (err) => {
        if (!err) {
          console.log(`Unsubscribe to ${topic}`);
        } else {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  getData() {
    return this.hcdata;
  }
}

module.exports = MqttClient;
