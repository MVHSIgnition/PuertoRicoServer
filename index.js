var express = require("express")
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(express.static(__dirname));

var dir  = "./transcript.txt";
var file = new File(dir);

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log("Server running on port %s", port);
});

io.on("connection", function(socket) {
    socket.on("info request",function(msg){
        //process request
        file.open("r");
        while(!file.eof){
            var line = file.readln();
            if(line.includes(msg))console.log(line);
        }
        file.close();
    });
});