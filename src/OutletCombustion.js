const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3021;
let flowCounterDirection = "up";
let flow = 6;
let rnd = 0.1;
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

    if (flowCounterDirection === "up") {
        flow=Math.round((flow+(Math.random()*0.1))*100)/100;
    } else {
        flow=Math.round((flow-(Math.random()*0.1))*100)/100;
    }
}, 1000)

function generateFlowAlarm(flow) {
    const millis = Date.now() - start;
    const alarm = {type: "CombustionFlowAlarm", timestamp: Math.floor(millis / 1000), argument: flow + " m"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);
}

function mqttSendAlarm(alarm) {
    let message = "";
    if (alarm.type === "CombustionFlowAlarm") {
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    }
    console.log("new alarm: " + message)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('reactorAlarm', message)


}

client.on('message', function (topic, message) {
    // message is Buffer
    console.log("got message: " + message.toString())
    client.end()
})