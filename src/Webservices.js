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

    /**
     * The addAlarm functions takes an Alarm as input and saves it to the Services generated Alarms Vector
     */
    addAlarm(alarm) {
        this.generatedAlarms.push(alarm);
    }

    /**
     * The setValueCounterDirection function alters the counting direction of the Service
     */
    setValueCounterDirection(direction) {
        this.valueCounterDirection = direction;
    }

    /**
     * The setValue alters the raw data value of the Service
     */
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
     * The mqttSendData sends out the current raw simulated sensor values. It takes the
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
const mqttClient = new MqttInterface('192.168.2.199'); //instanciate new MqttInterface
const startTime = Date.now(); //log start time for calculation of timestamp of the alarms
let generatedServices = []; //vector for all Services which were generated to allow for easy access
let allGeneratedAlarms = []; //vector for the generated alarms with all services combined

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


for (let i in services) {
    let newService = new Service(services[i].sensorType, services[i].valueType, services[i].value, services[i].unit, services[i].valueCounterDirection, services[i].port)
    startService(newService);
}

/**
 * The startService function generates a new http Server to allow for accessing the raw data through the browser
 * in this function the genratedServices are also written to the generatedServices Array
 */
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
    generateSimData();
}, 1000)

/**
 * The generateAlarm function generates a new Alarm of the Type corresponding to the Servicetype. It takes a Service as
 * argument the and generates a new alarm to be held inside the global generated Alarms vector and the local Service
 * Alarms Vector.
 */
function generateAlarm(service) {
    const millis = Date.now() - startTime;
    let alarmType = service.sensorType + "_" + service.valueType + "Alarm";
    let timestamp = Math.floor(millis / 1000);
    let argument = service.value + " " + service.unit;
    let newAlarm = new Alarm(alarmType, timestamp, argument)
    service.addAlarm(newAlarm);
    allGeneratedAlarms.push(newAlarm);
    mqttClient.sendAlarm(newAlarm);
}

/**
 * The generateSimData function generates the simulation Data in a loop in Order to simulate a real Sensor
 * The function writes the generated values directly into the generatedServices
 */
function generateSimData() {
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
}