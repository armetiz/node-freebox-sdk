node-freebox-sdk
================

SDK to manage Freebox v6.

**Right now, only wifi is manageable. Stay tuned.**

## Quick Examples
Toggle wifi connection and get wifi informations.

```js
var Freebox = require("freebox-sdk");
var freebox = new Freebox({
    password: "my_password",
    wifiChannel: 11,
    wifiHtMode: "disabled"  //disabled, 20, 40_lower, 40_upper
});

freebox.on("connect", function() {
    console.log("Connected");
    
    var getInformations = function () {
        freebox.wifiStations(function (result) {
            console.log("stations: " + result);
        });
        
        freebox.wifiStatus(function (result) {
            console.log("status: " + result);
        });
        
        freebox.wifiConfig(function (result) {
            console.log("config: " + result);
        });
    }
    
    freebox.wifiStatus(function (status) {
        if(status.active) {
            console.log("wifi is on");
            freebox.wifiOff(function (result) {
                console.log("wifi turns off");
                
                getInformations();
            });
        }
        else {
            console.log("wifi is off");
            freebox.wifiOn(function (result) {
                console.log("wifi turns on");
                
                getInformations();
            });
        }
    });
});

freebox.on("error", function(message) {
    console.log("error: " + message);
});

freebox.connect();
```

API
---

### new Freebox(options)

Password is the only mandatory option.

```js
var options = {};

options.password;   //default value: ""
options.hostname;   //default value: "mafreebox.free.fr";
options.port        //default value: 80
options.login       //default value: "freebox";
options.wifiChannel //default value: 9;
options.wifiHtMode  //default value: "disabled";
```

wifiHtMode allowed values : "disabled", 20, "40_lower", "40_upper"

### freebox.connect()

Start a connection between Node and Freebox.

### freebox.wifiStations(callback)

Get wifi connected stations.
Callback take one "result" argument.

### freebox.wifiStatus(callback)

Get wifi status.
Callback take one "result" argument.

### freebox.wifiConfig(callback)

Get wifi configuration.
Callback take one "result" argument.

### freebox.wifiOn(callback)

Switch on WiFi.
Callback take one "result" argument.

### freebox.wifiOff(callback)

Switch off WiFi.
Callback take one "result" argument.