var express = require("express")
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var fs = require("fs");

app.use(express.static(__dirname));

//var dir  = "./broadcast.txt";

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log("Server running on port %s", port);
});

io.on("connection", function(socket) {
    socket.on("info request",function(msg){
        var jsonf;
        fs.readFile("./transcript.json","utf8",function(err,contents){
            if(err)throw err;
            jsonf = JSON.parse(contents);
        });
        for(var i = 0; i < jsonf.data.length; i++){
            line = jsonf.data[i];
            if(line.includes(msg.toUpperCase()))console.log(line);
        }
    });
});