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
        if(msg.includes(","))msg = msg.split(",");
        else msg = [msg];
        fs.readFile("./transcript.json","utf8",function(err,contents){
            if(err)throw err;
            var jsonf = JSON.parse(contents);
            for(var i = 0; i < msg.length; i++){
                //line = jsonf.data[i];
                var matches = [msg[i]];
                for(var j = 0; j < jsonf.data.length; j++){
                    line = jsonf.data[j];
                    if(line.includes(msg[i].trim().toUpperCase())) {
                        console.log(line);
                        matches.push(line);
                    }
                }
                if(matches.length == 1)matches.push("No information found.");
                socket.emit("info response", matches);
            }
        });
    });
    socket.on("info add",function(msg){
        var json;
        fs.readFile("./transcript.json","utf8",function(err,contents){
            if(err)throw err;
            json = JSON.parse(contents);
        })
        .then(function(){
            json.data.push(msg)
            fs.writeFile("./transcript.json",json,function(err){
                if(err) throw err;
            });
        });    
        
    
    });
});