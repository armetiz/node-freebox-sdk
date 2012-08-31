node-freebox-sdk
================

SDK to manage Freebox v6

## Quick Examples
Toggle wifi connection and get wifi informations.

```js
var Freebox = require("freebox");
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