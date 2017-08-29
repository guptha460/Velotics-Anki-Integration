// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
// var bodyParser = require('body-parser');
var WebSocket = require('ws');
var cfenv = require('cfenv');
var appenv=cfenv.getAppEnv();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text());


var port = appenv.port || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();  


router.post('/',function(req, res) {
    
 var jsondata=JSON.parse(req.body);
 var carId = "";
 var carName = "";

var groupIdValue = req.query.piname;

//"wss://mgwws.hana.ondemand.com/endpoints/v1/ws"
var ws=new WebSocket("wss://mgwws.hana.ondemand.com/endpoints/v1/ws");
ws.on('open', function open(event) 
{

ws.send(JSON.stringify({"subscribe":"in/"+groupIdValue+"/controller/cars"}));
 


 });




ws.on('message', function open(event) 
  {

               var carId,carName;
               var json = JSON.parse(event);      
       
                             
        if (json.deviceName == "controller") 
        {
                                                                if (json.param == "cars") 
                                                                {
                                                                                var values = json.value;
                                                                                var cars = values.cars;
                                                                                carId = cars[0]["id"];
                                                                                carName = cars[0]["name"];

                                                                }

                                                                console.log(req.body);

                              
                               var speed=1;           
                               
                          

                                var msg = JSON.stringify({
                                                "msgType": "UPDATE_S",
                                                "macAddress": carId,
                                                "deviceName": carName,
                                                "deviceType": "AnkiCar",
                                                "groupId": groupIdValue,
                                                "param": "command",
                                                "value": "s "+parseInt((jsondata.speed)/50),
                                                "valueDimension": "na"
                                });
                                console.log(msg);
                                ws.send(msg);
                              
                                                                
        }
          res.send("201");

});

 });

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);





