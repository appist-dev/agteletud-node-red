const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3022;
let flowCounterDirection = "up";
let flow = 2;
let generatedAlarms = [];
const start = Date.now();

let client = mqtt.connect('mqtt://192.168.2.199')

const server = http.createServer(function (req, res) {   //create web server
    if (req.url === '/') { //check the URL of the current request

        // set response header
        res.writeHead(200, {'Content-Type': 'text/html'});

        // set response content
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

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

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

function generateFlowAlarm(flow) {
    const millis = Date.now() - start;
    const alarm = {type: "ProductFlowAlarm", timestamp: Math.floor(millis / 1000), argument: flow + " L/m"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);
}

function mqttSendAlarm(alarm) {
    let message = "";
    if (alarm.type === "ProductFlowAlarm") {
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    }
    console.log("new alarm: " + message)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('AlarmDomain', message)
}

function mqttSendData(flow) {
    let message = "" + flow.toString();

    if (!client.connected) {
        client.reconnect();
    }
    client.publish('OutletProduct', message)
}