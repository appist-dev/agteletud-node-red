//setup needed packages http and mqtt
const http = require('http');
const mqtt = require('mqtt');

//setup variables and ip-adress for client and host
const hostname = '192.168.2.169';
const client = mqtt.connect('mqtt://192.168.2.199')
const start = Date.now();

let generatedAlarms = []; //vector for the generated alarms in which simulation values will grow

let services = [{sensorType: "InletAir", valueType: "flow",value:3, unit: "L/m",valueCounterDirection:"up", port: 3000},
    {sensorType: "InletFluid_A", valueType: "flow",value:7, unit: "L/m",valueCounterDirection:"up", port:3001},
    {sensorType: "InletFluid_B", valueType: "flow",value:5, unit: "L/m",valueCounterDirection:"up", port:3002},
    {sensorType: "InletFuel", valueType: "flow",value:4, unit: "L/m",valueCounterDirection:"up",port:3003},
    {sensorType: "OutletCombustion", valueType: "flow",value:6, unit: "L/m",valueCounterDirection:"up",port:3004},
    {sensorType: "OutletProduct", valueType: "flow",value:2, unit: "L/m",valueCounterDirection:"up",port:3005},
    {sensorType: "RotationSensorMotor", valueType: "rotationSpeed",value:20, unit: "u/min",rotationSpeedCounterDirection:"up",port:3006},
    {sensorType: "TempSensorCombustion", valueType: "temp",value:300, unit: "°C",valueCounterDirection:"up",port:3007},
    {sensorType: "TempSensorProduct", valueType: "temp",value:100, unit: "°C",valueCounterDirection:"up",port:3008},
    {sensorType: "FillLevelSensorReactor", valueType: "fillLevel",value:20, unit: "%",valueCounterDirection:"up",port:3009}]
let generatedServices = [];

for (let i in services){
    console.log(services[i]);
    startService(services[i]);
}

function startService(service){
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
    startedService.listen(service.port,hostname, () => {
        console.log(service.sensorType+` server running at http://${hostname}:${service.port.toString()}/`);
    });
    generatedServices.push(service);
}

//loop for generating simulation data and to check for any reached predefined limits for the alarms
setInterval(() => {
    for (let i in services){
        if (services[i].valueType === "rotationSpeed"){
            if (services[i].rotationSpeedCounterDirection === "up") services[i].value+=Math.floor(Math.random() * 5) + 1; else services[i].value-=Math.floor(Math.random() * 5) + 1;
            switch (true) {
                case (services[i].value >= 240):
                    services[i].rotationSpeedCounterDirection = "down";
                    generateAlarm(services[i]);
                    break;
                case (services[i].value <= 3):
                    services[i].rotationSpeedCounterDirection = "up";
                    generateAlarm(services[i]);
                    break;
            }
        }
        else if (services[i].valueType === "temp"){
            if (services[i].tempCounterDirection === "up") services[i].value+=Math.floor(Math.random() * 4) + 1; else services[i].value-=Math.floor(Math.random() * 4) + 1;
            switch (true) {
                case (services[i].value >= 390):
                    services[i].tempCounterDirection = "down";
                    generateAlarm(services[i]);
                    break;
                case (services[i].value <= 80):
                    services[i].tempCounterDirection = "up";
                    generateAlarm(services[i]);
                    break;
            }
        }
        else if (services[i].valueType === "fillLevel"){
            if (services[i].fillLevelCounterDirection === "up") services[i].value++; else services[i].value--;
            switch (true) {
                case (services[i].value >= 90):
                    generateAlarm(services[i]);
                    services[i].fillLevelCounterDirection = "down";
                    break;
                case (services[i].value <= 10):
                    services[i].fillLevelCounterDirection = "up";
                    generateAlarm(services[i]);
                    break;
            }
        }
        else{
            if (services[i].valueCounterDirection === "up") {
                services[i].value = Math.round((services[i].value + (Math.random() * 0.1)) * 100) / 100;
            } else {
                services[i].value = Math.round((services[i].value - (Math.random() * 0.1)) * 100) / 100;
            }

            switch (true) {
            case (services[i].value >= 9):
                services[i].valueCounterDirection = "down";
                generateAlarm(services[i]);
                break;
            case (services[i].value <= 1):
                services[i].valueCounterDirection = "up";
                generateAlarm(services[i]);
                break;
            }
        }
        mqttSendData(services[i]);
    }


}, 500)

/**
 * The generateAlarm generates a new Alarm of Type "AirFlowAlarm". It takes the
 * amount of data as argument and generates a new alarm to be held inside the generated Alarms vector.
 */
function generateAlarm(service) {
    const millis = Date.now() - start;
    const alarm = {type: service.sensorType+"_"+service.valueType+"Alarm", timestamp: Math.floor(millis / 1000), argument: service.value + " "+service.unit};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);
}

/**
 * The mqttSendAlarm sends out an existing alarm. It takes an alarm
 * as argument, generates a comma seperated string and publishes it via mqtt to a topic which is
 * subscribed by Node-Red.
 */
function mqttSendAlarm(alarm) {
    let message = "";
    message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    console.log("new alarm: " + message)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('AlarmDomain', message)
}

/**
 * The mqttSendData sends out the current data rate. It takes the
 * amount of data as argument and publishes it via mqtt to a topic which is
 * subscribed by Node-Red.
 */
function mqttSendData(service) {
    let message = "" + service.value.toString();

    if (!client.connected) {
        client.reconnect();
    }
    client.publish(service.sensorType, message)
}