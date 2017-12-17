var express = require("express")
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var fs = require("fs");
var request = require("request");

//app.use(express.static(__dirname));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log("Server running on port %s", port);
});

io.on("connection", function(socket) {
    socket.on("info request",function(msg){
        if(msg.includes(","))msg = msg.split(",");
        else msg = [msg];
				
				for (var i = 0; i < msg.length; i++) {
					if (msg[i].includes("+")) msg[i] = msg[i].split("+");
					else msg[i] = [msg[i]];
				}
        fs.readFile("./transcript.json","utf8",function(err,contents){
            if(err)throw err;
            var jsonf = JSON.parse(contents);
            for(var i = 0; i < msg.length; i++){
                //line = jsonf.data[i];
                var matches = [msg[i].join(" + ")]; 
                for(var j = 0; j < jsonf.data.length; j++){
                    line = jsonf.data[j];
                    var match = true;
                    for (var k = 0; k < msg[i].length; k++) {
                        if (!line.toUpperCase().includes(msg[i][k].trim().toUpperCase())) {
                            match = false;
                        }
                    }
                    //remove similar items
                    for (var k = 1; k < matches.length; k++) {
                        if (checkSimilar(matches[k], line)) {
                            console.log("removing line: " + line);
                            match = false;
                        }
                    }
                    
                    if (match) {
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

function checkSimilar(text1, text2) {
    text1 = text1.split(" ");
    text2 = text2.split(" ");
    
    if (text1.length > 1 && text2.length > 1) {
        var count = 0;
        
        for (var i = 0; i < text1.length; i++) {
            for (var j = 0; j < text2.length; j++) {
                if (i == j && text1[i] == text2[j]) {
                    count++;
                }
            }
        }
    }
    
    if (count >= text1.length-2 || count >= text2.length-2) {
        return true;
    }
    return false;
}