'use strict';

module.exports = function (RED) {
    const SHT31 = require('sht31-sensor');

    function Sht31(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.bus = parseInt(n.bus);
        node.addr = parseInt(n.address, 16);
        node.topic = n.topic || "";
        node.initialized = false;

        // init the sensor
        node.status({ fill: "grey", shape: "ring", text: "Init..." });
        node.log("Initializing on bus" + node.bus + " addr:" + node.addr);
        node.sensor = new SHT31({ i2cBusNo: node.bus, i2cAddress: node.addr });
        var fnInit= function() {
            node.sensor.init().then(function (ID) {
                node.initialized = true;
                node.type = "SHT31";
                node.status({ fill: "green", shape: "dot", text: node.type + " ready" });
                node.log("Sensor " + node.type + " initialized.");
            }).catch(function (err) {
                node.status({ fill: "red", shape: "ring", text: "Sensor Init Failed" });
                node.error("Sensor Init failed ->" + err);
            });
        };
        // Init
        fnInit();
        // trigger measure
        node.on('input', function (_msg) {
            if (!node.initialized) {
                //try to reinit node until no sensor is found
                fnInit();
                return null;
            }
            node.sensor.readSensorData().then(function (data) {
                _msg.payload = data;
                data.model = node.type;
                if (node.topic !== undefined && node.topic != "") _msg.topic = node.topic;
                node.send(_msg);
                var sText = node.type + "[Tcº:" + Math.round(data.temperature_C);
                if (node.isBME) sText += ("/H%:" + Math.round(data.humidity));
                node.status({ fill: "green", shape: "dot", text: sText + "]" });
            }).catch(function (err) {
                node.status({ fill: "red", shape: "ring", text: "Sensor reading failed" });
                node.error("Failed to read data ->" + err);
            });
            return null;
        });

    } // Sht31

    RED.nodes.registerType("Sht31", Sht31);
};
