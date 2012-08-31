node-freebox-sdk
================

SDK to manage Freebox v6

## Quick Examples
Get the WIFI Status

```js
var Freebox = require("freebox");
var freebox = new Freebox("my_pass");

freebox.on("connect", function() {
    console.log("Connected");
    
    freebox.wifiStatus(function (isOn) {
        console.log("wifi is: " + (isOn ? "on" : "off"));
    });
});

freebox.connect();
```