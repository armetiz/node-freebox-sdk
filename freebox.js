var http = require("http");
var events = require("events");
var jQuery = require("jQuery");

module.exports = function (password) {
    var self = new events.EventEmitter();
    var cookie;
    
    self.connect = function () {
        var http = require("http");
        var querystring = require("querystring");

        var data = querystring.stringify({
            login: "freebox",
            passwd: password
        });

        var options = {
            host: "mafreebox.free.fr",
            port: 80,
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
    
    var request = function (path, end) {
        var options = {
            host: "mafreebox.free.fr",
            port: 80,
            method: "GET",
            path: path,
            headers: {
                cookie: cookie
            }
        };

        req = http.request(options, function(res) {
            res.setEncoding('utf8');
            
            var body = "";
            
            res.on('data', function (chunk) {
                body += chunk;
            });
            
            res.on('end', function () {
                end(body);
            });
        });
        
        req.on('error', function(e) {
            self.emit("error", "can't check wifi status");
        });
        
        req.end();
    };
    
    self.wifiStatus = function (callback) {
        request("/settings.php?page=wifi_conf", function(body) {
            callback ("checked" === jQuery(body).find("input[name=enabled]").attr("checked"));
        });
    };
    
    return self;
};
