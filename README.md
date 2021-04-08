# node-red-contrib-sht31

A node-red custom node wrapper for the nodejs [sht31-sensor](https://github.com/belveder79/sht31-sensor) by @belveder79 . This library uses the outstanding package [i2c-bus](https://github.com/fivdi/i2c-bus) that enable the communication with I2C devices in most common Linux SBCs. Raspberry Pi, C.H.I.P., BeagleBone, Orange Pi,  or Intel Edison are supported by this package.

The package provide a single custom node __Sht31__ that can be used directly in your flow.


## Installation

Under your node-red (typically ``$HOME/.node-red``) working directory.

``
npm install node-red-contrib-sht31
``

Node palette can be used as well to install the node.

After restarting node-red the "Sht31" node should be available in "input" category.

## Prerequisites

Wire your sensor the I2C/TWI of the SBCs. Only four wires are needed. two for power (VCC 3.3V & GND) and two for actual I2C transmission (SLC & SDA).

I2C interface need to be enabled in in your linux distribution.

>__Caveat__:
> Check your permissions to the /dev/i2c-xx devices. The user running node-red need access to writing and reading.
> Refer to [i2c-bus](https://github.com/fivdi/i2c-bus) to find how to grant access to your user to the /dev/i2c-xx device files

## Usage

### Configuration & deployment
After installation place your Sht31 node in any of your flow and configure the following parameters:

1. __Name:__ Select the name of your sensor for easy identification.
2. __Bus ID:__ Select the I2C bus to which the sensor is connected. Depending on your wiring and SBC can be different.
3. __I2C address:__ I2C address (7-bit) hexdecimal address(0x##). BMP/BME280 sensor have fixed 0x77 or 0x76. You can check your sensor id by using i2c-tools typing ``i2cdetect -y <busnum>``
4. __Topic:__ Topic field set on the output message. If this field is empty, topic will not be included in the output msg. By configuring the node this way input msg topic will be reused.

After configuration and deployment the node will init the sensor and will identify if BME280 or BMP280 variant is detected.  

### Reading Sensor Data
As in other node-red nodes the actual measurement of sensor data require that an input msg arrive to the node. The input called __Trigger__ will start the reading of sensor data will send the data in the node's output. The input __msg is reused__ so any property on the input msg (with the exception of payload and topic if set) will be redirected without modification to the output.

The __output__ will have the following format:

```
msg = {
  _msgid: <node-red msg_id>,
  topic: <defined topic>,
  payload: {
    model: "BME280"  or  "BMP280",
    temperature_C: <float in celsius>,
    humidity: <float in %>, // Only present if model == "BME280"
    pressure_hPa: <float in hPa>
  }
}

// the node node is configured to send extra information payload will contain also

payload: {
     ....
     heatIndex: <float in celsius>, // Only present if model == "BME280"
     dewPoint_C= <float in celsius>, // Only present if model == "BME280"
     altitude_M= <float in Meters>,
     temperature_F=<float in fahrenheit>
     pressure_Hg=<float in mm of mercury>
}

```

## Disclaimer

A lot of code snippets, inspiration and even this README was largely taken from the [contrib module](https://github.com/ludiazv/node-red-contrib-bme280) implementation from @ludiazv (actually almost everything). The node was only tested on a RockPro64 board and a custom SHT31 sensor implementation from [AR4 GmbH](https://www.ar4.io).

## Change log

* 0.0.1 First version
