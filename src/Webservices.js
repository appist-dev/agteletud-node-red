//setup needed packages http and mqtt
const mqtt = require('mqtt');
const file_system = require('fs')

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

    /**
     * The function sendAlarm sends out an existing alarm. It takes an alarm
     * as argument, generates a comma seperated string and publishes it via mqtt to a topic which is
     * subscribed by Node-Red.
     */
    sendAlarm(client,alarm) {
        let message = "";
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
        console.log("\n NEW ALARM: " + message)

        client.publish('AlarmTopic', message, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
    }

    /**
     * The sendData function sends out the current raw simulated sensor values. It takes the
     * amount of data as argument and publishes it via mqtt to a topic which is
     * subscribed by Node-Red.
     */
    sendData(client,service) {
        let message = "" + service.value.toString();

        client.publish(service.sensorType.toString(), message, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
    }
    /**
     * The sendClientHello function sends "simulation started" out to the node-red server when the services
     * have been restarted to signal a reset of all diagrams.
     */
    sendClientHello(client) {
        let message = "I-AT Node-Red webservice simulation started";

        client.publish('ClientHello', message, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })

    }
}

// read specified ip-address of node-red mqtt server from config file, give user advice in case of error
let mqtt_ip_address = "localhost";
try {
    const data = file_system.readFileSync('./src/mqtt_ip_address.config', 'utf8');
    mqtt_ip_address =  data.split(/\r?\n/)[1].replace("IP-ADDRESS=", "");
    if (!validateIPaddress(mqtt_ip_address)){
        console.log("\nSpecified IP-address of Node-Red MQTT Server: "+mqtt_ip_address);
        console.log("\n-------------ATTENTION--------------");
        console.log("Please enter a valid ip-address for the node-red mqtt server with the scheme: '123.456.7.89' in the config file and do not edit the other contents of the file:");
        process.exit();
    }
    else{
        console.log("\nSpecified IP-address of Node-Red MQTT Server: "+mqtt_ip_address);
        console.log('\n');
    }

} catch (err) {
    console.log("\n-------------ATTENTION--------------");
    console.log('Please make sure to have the file "mqtt_ip_address.config" in the "src" folder');
    process.exit();
}

//setup variables and insert specified ip-address for mqtt server and host computer
//create new MqttInterface
const startTime = Date.now(); //log start time for calculation of timestamp of the alarms
let generatedServices = []; //vector for all Services which were generated to allow for easy access
let allGeneratedAlarms = []; //vector for the generated alarms with all services combined

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const client = mqtt.connect(`mqtt://${mqtt_ip_address}:${1883}`, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})
const mqttInterface = new MqttInterface();
client.on('connect', () => {
  console.log('Connected')
    mqttInterface.sendClientHello(client);

  })
//configuration of all services
let serviceConfiguration = [
    {
        sensorType: "InletAir",
        valueType: "flow",
        value: 1,
        unit: "L/m",
        valueCounterDirection: "up",
        port: 3000
    },
    {
        sensorType: "InletFluid_A",
        valueType: "flow",
        value: 8,
        unit: "L/m",
        valueCounterDirection: "up",
        port: 3001
    },
    {
        sensorType: "InletFuel",
        valueType: "flow",
        value: 5,
        unit: "L/m",
        valueCounterDirection: "up",
        port: 3002
    },
    {
        sensorType: "OutletCombustion",
        valueType: "flow",
        value: 5,
        unit: "L/m",
        valueCounterDirection: "down",
        port: 3003
    },
    {
        sensorType: "OutletProduct",
        valueType: "flow",
        value: 5,
        unit: "L/m",
        valueCounterDirection: "up",
        port: 3004
    },
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

//generate new Service Objects from the serviceConfiguration
console.log("Started Simulation for Services:");
for (let i in serviceConfiguration) {
    let newService = new Service(serviceConfiguration[i].sensorType, serviceConfiguration[i].valueType,
        serviceConfiguration[i].value, serviceConfiguration[i].unit, serviceConfiguration[i].valueCounterDirection,
        serviceConfiguration[i].port)
    console.log("Service "+(i)+" : "+newService.sensorType);
    generatedServices.push(newService);
}

//loop for generating simulation data and to check for any reached predefined limits for the alarms
setInterval(() => {
    generateSimData();
}, 1000) //timeout for interval of sending new sim data to node-red

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
    mqttInterface.sendAlarm(newAlarm);
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
        mqttInterface.sendData(service);
    }
}

/**
 * The validateIPaddress function takes an ipv4 address and checks for correct syntax with regex it returns true  in case
 * of success and false in case of failure
 *
 */
function validateIPaddress(ipaddress) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);

}