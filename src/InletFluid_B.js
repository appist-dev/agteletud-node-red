//setup needed packages http and mqtt
const http = require('http');
const mqtt = require('mqtt');

//setup variables and ip-adress for client and host
const hostname = '192.168.2.169';
const port = 3014; //defined port for this web-service
let flowCounterDirection = "up"; //direction in which simulation values will grow
let flow = 5;
let generatedAlarms = []; //vector for the generated alarms in which simulation vlaues will grow
const start = Date.now();
let client = mqtt.connect('mqtt://192.168.2.199')

//configure a new server to act as http server to access raw simulation data
const server = http.createServer(function (req, res) {
    if (req.url === '/') {

        // setup http response header
        res.writeHead(200, {'Content-Type': 'text/html'});

        // setup http response content
        res.write(
            '<html>' +
            '<body>' +
            '<div>' +
            '<p id="flow">' + flow + '</p>' +
            '</div>' +
            '</body>' +
            '</html>');
        res.end();
    } else
        res.end('Invalid Request!');
});

//start the server and continue running on a defined port and hostname
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//loop for generating simulation data and to check for any reached predefined limits for the alarms
setInterval(() => {

    if (flowCounterDirection === "up") {
        flow = Math.round((flow + (Math.random() * 0.1)) * 100) / 100;
    } else {
        flow = Math.round((flow - (Math.random() * 0.1)) * 100) / 100;
    }

    switch (true) {
        case (flow >= 9):
            flowCounterDirection = "down";
            generateFlowAlarm(flow);
            break;
        case (flow <= 1):
            flowCounterDirection = "up";
            generateFlowAlarm(flow);
            break;
    }

    mqttSendData(flow);
}, 1000)

/**
 * The generateFlowAlarm generates a new Alarm of Type "Fluid_BFlowAlarm". It takes the
 * amount of flow as argument and generates a new alarm to be held inside the generated Alarms vector.
 */
function generateFlowAlarm(flow) {
    const millis = Date.now() - start;
    const alarm = {type: "Fluid_BFlowAlarm", timestamp: Math.floor(millis / 1000), argument: flow + " L/m"};
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
    console.log("new alarm: " + alarm)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('AlarmDomain', message)
}

/**
 * The mqttSendData sends out the current flow rate. It takes the
 * amount of flow as argument and publishes it via mqtt to a topic which is
 * subscribed by Node-Red.
 */
function mqttSendData(flow) {
    let message = "" + flow.toString();

    if (!client.connected) {
        client.reconnect();
    }
    client.publish('InletFluid_B', message)
}