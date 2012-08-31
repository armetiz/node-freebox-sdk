var http = require("http");
var events = require("events");
var querystring = require("querystring");

module.exports = function (options) {
    options = options || {};
    
    var hostname = options.hostname || "mafreebox.free.fr";
    var port = options.port || 80;
    var login = "freebox";
    var wifiChannel = options.wifiChannel || 9;
    var wifiHtMode = options.wifiHtMode || "disabled";
    var password = options.password || "";

    var connected = false;
    var self = new events.EventEmitter();
    var cookie;
    
    self.connect = function () {
        var data = querystring.stringify({
            login: login,
            passwd: password
        });

        var options = {
            host: hostname,
            port: port,
            method: "POST",
            path: "/login.php",
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': data.length
            }
        };

        var req = http.request(options, function(res) {
            if(res.statusCode === 302) {
                cookie = res.headers['set-cookie'];
                cookie = new String(cookie);
                cookie = cookie.substr(0, cookie.indexOf(";"));

                connected = true;

                self.emit("connect");
            }
            else {
                self.emit("error", "check your password");
            }
        });

        req.on('error', function(e) {
            self.emit("error", "check the connection");
        });

        req.write(data);
        req.end();
    }
    
    var request = function (path, data, end) {
        if(false === connected) {
            throw "You have to be connected before use any functions";
        }
        
        var dataStringify = querystring.stringify(data);
        var options = {
            host: hostname,
            port: port,
            method: "POST",
            path: path,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': dataStringify.length,
                'cookie': cookie
            }
        };

        req = http.request(options, function(res) {
            if(res.statusCode !== 200) {
                self.emit("error", "get a HTTP Error: " + res.statusCode);
                return;
            }
            
            res.setEncoding('utf8');
            
            var body = "";
            
            res.on('data', function (chunk) {
                body += chunk;
            });
            
            res.on('end', function () {
                end(JSON.parse(body));
            });
        });
        
        req.on('error', function(e) {
            self.emit("error", "problem on: " + path);
            return;
        });
        
        req.write(dataStringify);
        req.end();
    }
    
    self.wifiOn = function (callback) {
        var data = {
            method: "wifi.ap_params_set",
            enabled: "on",
            ht_mode: wifiHtMode,
            channel: wifiChannel,
            config: "Valider"
        };
        
        request("/wifi.cgi", data, function(result) {
            if(callback) {
                callback(result);
            }
        });
    }
    
    self.wifiOff = function (callback) {
        var data = {
            method: "wifi.ap_params_set",
            enabled: "off",
            ht_mode: wifiHtMode,
            channel: wifiChannel,
            config: "Valider"
        };
        
        request("/wifi.cgi", data, function(result) {
            if(callback) {
                callback(result);
            }
        });
    }
    
    self.wifiConfig = function (callback) {
        var data = {
            method: "wifi.config_get"
        };
        
        request("/wifi.cgi", data, function(result) {
            callback(result.result);
        });
    }
    
    self.wifiStatus = function (callback) {
        var data = {
            method: "wifi.status_get"
        };
        
        request("/wifi.cgi", data, function(result) {
            callback(result.result);
        });
    }
    
    self.wifiStations = function (callback) {
        var data = {
            method: "wifi.stations_get"
        };
        
        request("/wifi.cgi", data, function(result) {
            callback(result);
        });
    }
    
    return self;
};
