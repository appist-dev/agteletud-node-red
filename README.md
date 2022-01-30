<p align="center">
  <img src="docs/images/logo/Node-Red-Scada-Node.png" width="50%">
</p>

# AG Teleautomation Node-Red WS 2021/2022
## Description

This student project is part of the course "Industrielle Automatisierungstechnik" at the TU Dresden. 
The aim of the project is to showcase the capabilities of the open-source tool Node-Red.

## Additional Information
- student name: Marcus Rothhaupt

- course website: https://wiki.agtele.eats.et.tu-dresden.de/doku.php?id=iat-bm:start
  (*only reachable within the network of the TU Dresden*)

## Prerequisites

- npm (*tested with 8.1.2*)
- node.js (*tested with 16.13.2*)
- node-red (*tested with 2.1.3*)

## Node-Red Modules required

  - node-red
  - node-red-contrib-aedes
  - node-red-dashboard
  - node-red-node-pi-gpio
  - node-red-node-ping
  - node-red-node-random
  - node-red-node-serialport
  - node-red-node-smooth
  - node-red-node-ui-table


## Edit the Node-Red MQTT Server IP Address
- take the .json from <code>/node-red-flow/</code> and import it into Node-Red
- set up the MQTT Server in Node-Red

## Edit the Node-Red MQTT Server IP Address
- edit the config file under <code>/src/mqtt_ip_address.config</code>
- change the line <code>IP-ADDRESS=192.168.XXX.XXX</code> to the adress of your Node-Red MQTT Server

***

## Running the code

- <code>npm install</code>
- <code>npm run start</code>

