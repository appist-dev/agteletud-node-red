//setup needed packages http and mqtt
const http = require('http');
const mqtt = require('mqtt');

class Service {
    constructor(sensorType, valueType, value, unit, valueCounterDirection, port) {
        this.sensorType = sensorType;
        this.valueType = valueType;
        this.value = value;
        this.unit = unit;
        this.valueCounterDirection = valueCounterDirection;
        this.port = port;
        this.generatedAlarms = [];

    }

    addGeneratedAlarm(alarm) {
        this.generatedAlarms.push(alarm);
    }

    setValueCounterDirection(direction) {
        this.valueCounterDirection = direction;
    }

    setValue(value) {
        this.value = value;
    }
}

class Alarm {
    constructor(type, timestamp, argument) {
        this.type = type;
        this.timestamp = timestamp;
        this.argument = argument;
    }
}

class MqttInterface {
    constructor(brokerUrl) {
        this.brokerUrl = brokerUrl;
        this.client = mqtt.connect('mqtt://' + this.brokerUrl);
    }

    /**
     * The function sendAlarm sends out an existing alarm. It takes an alarm
     * as argument, generates a comma seperated string and publishes it via mqtt to a topic which is
     * subscribed by Node-Red.
     */
    sendAlarm(alarm) {
        let message = "";
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
        console.log("new alarm: " + message)
        if (!this.client.connected) {
            this.client.reconnect();
        }
        this.client.publish('AlarmDomain', message)
    }
    /**
     * The mqttSendData sends out the current data rate. It takes the
     * amount of data as argument and publishes it via mqtt to a topic which is
     * subscribed by Node-Red.
     */
    sendData(service) {
      let message = "" + service.value.toString();

      if (!this.client.connected) {
          this.client.reconnect();
      }
      this.client.publish(service.sensorType, message)
    }
}




//setup variables and ip-adress for client and host
const hostname = '192.168.2.169';
let mqttClient = new MqttInterface('192.168.2.199');
const start = Date.now();

let allGeneratedAlarms = []; //vector for the generated alarms in which simulation values will grow

let services = [{
    sensorType: "InletAir",
    valueType: "flow",
    value: 1,
    unit: "L/m",
    valueCounterDirection: "up",
    port: 3000
},
    {sensorType: "InletFluid_A", valueType: "flow", value: 8, unit: "L/m", valueCounterDirection: "up", port: 3001},
    {sensorType: "InletFuel", valueType: "flow", value: 5, unit: "L/m", valueCounterDirection: "up", port: 3002},
    {
        sensorType: "OutletCombustion",
        valueType: "flow",
        value: 5,
        unit: "L/m",
        valueCounterDirection: "down",
        port: 3003
    },
    {sensorType: "OutletProduct", valueType: "flow", value: 5, unit: "L/m", valueCounterDirection: "up", port: 3004},
    {
        sensorType: "RotationSensorMotor",
        valueType: "rotationSpeed",
        value: 20,
        unit: "u/min",
        valueCounterDirection: "up",
        port: 3005
    },
    {
        sensorType: "TempSensorCombustion",
        valueType: "temp",
        value: 300,
        unit: "°C",
        valueCounterDirection: "down",
        port: 3006
    },
    {
        sensorType: "TempSensorProduct",
        valueType: "temp",
        value: 100,
        unit: "°C",
        valueCounterDirection: "up",
        port: 3007
    },
    {
        sensorType: "FillLevelSensorReactor",
        valueType: "fillLevel",
        value: 20,
        unit: "%",
        valueCounterDirection: "down",
        port: 3008
    }]
let generatedServices = [];


for (let i in services) {
    let newService = new Service(services[i].sensorType, services[i].valueType, services[i].value, services[i].unit, services[i].valueCounterDirection, services[i].port)
    startService(newService);
}

function startService(service) {
    //configure a new server to act as http server to access raw simulation data
    let startedService = http.createServer(function (req, res) {
        if (req.url === '/') {

            // setup http response header
            res.writeHead(200, {'Content-Type': 'text/html'});

            // setup http response content
            res.write(
                '<html>' +
                '<body>' +
                '<div>' +
                '<p>' + service.value + '</p>' +
                '</div>' +
                '</body>' +
                '</html>');
            res.end();
        } else
            res.end('Invalid Request!');
    });

//start the server and continue running on a defined port and hostname
    startedService.listen(service.port, hostname, () => {
        console.log(service.sensorType + ` server running at http://${hostname}:${service.port.toString()}/`);
    });
    generatedServices.push(service);
}

//loop for generating simulation data and to check for any reached predefined limits for the alarms
setInterval(() => {
    for (let i in generatedServices) {
        let service = generatedServices[i];
        if (service.valueType === "rotationSpeed") {
            if (service.valueCounterDirection === "up") {
                service.setValue(service.value + Math.floor(Math.random() * 5) + 1);
            } else {
                service.setValue(service.value - Math.floor(Math.random() * 5) + 1);
            }
            switch (true) {
                case (service.value >= 240):
                    service.setValueCounterDirection("down");
                    generateAlarm(service);
                    break;
                case (service.value <= 3):
                    service.setValueCounterDirection("up");
                    generateAlarm(service);
                    break;
            }
        } else if (service.valueType === "temp") {
            if (service.valueCounterDirection === "up") {
                service.setValue(service.value + Math.floor(Math.random() * 4) + 1);
            } else {
                service.setValue(service.value - Math.floor(Math.random() * 4) + 1);
            }
            switch (true) {
                case (service.value >= 390):
                    service.setValueCounterDirection("down");
                    generateAlarm(service);
                    break;
                case (service.value <= 80):
                    service.setValueCounterDirection("up");
                    generateAlarm(service);
                    break;
            }
        } else if (service.valueType === "fillLevel") {
            if (service.valueCounterDirection === "up") service.value++; else service.value--;
            switch (true) {
                case (service.value >= 90):
                    generateAlarm(service);
                    service.setValueCounterDirection("down");
                    break;
                case (service.value <= 10):
                    service.setValueCounterDirection("up");
                    generateAlarm(service);
                    break;
            }
        } else {
            if (service.valueCounterDirection === "up") {
                service.setValue(Math.round((service.value + (Math.random() * 0.1)) * 100) / 100);
            } else {
                service.setValue(Math.round((service.value - (Math.random() * 0.1)) * 100) / 100);
            }

            switch (true) {
                case (service.value >= 9):
                    service.setValueCounterDirection("down");
                    generateAlarm(service);
                    break;
                case (service.value <= 1):
                    service.setValueCounterDirection("up");
                    generateAlarm(service);
                    break;
            }
        }
        mqttClient.sendData(service);
    }


}, 1000)

/**
 * The generateAlarm generates a new Alarm of Type "AirFlowAlarm". It takes the
 * amount of data as argument and generates a new alarm to be held inside the generated Alarms vector.
 */
function generateAlarm(service) {
    const millis = Date.now() - start;
    let alarmType = service.sensorType + "_" + service.valueType + "Alarm";
    let timestamp = Math.floor(millis / 1000);
    let argument = service.value + " " + service.unit;
    let newAlarm = new Alarm(alarmType, timestamp, argument)
    service.addGeneratedAlarm(newAlarm);
    allGeneratedAlarms.push(newAlarm);
    mqttClient.sendAlarm(newAlarm);
}

