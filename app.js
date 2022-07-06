require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const ejs = require("ejs");
 
app.set('view engine','ejs');
app.use('/public', express.static('public'))

app.get('/',function(req,res){
    res.sendFile(__dirname+"/app.html");
})
 
app.post("/",function(req,res){

    const query = req.body.city;
    if(query==""){
        res.sendFile(__dirname+"/app.html");
    }

    else{
        const api = process.env.SEARCH;
        const unit = "metric"; 
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+api;
            https.get(url, function(response){
            console.log(response.statusCode); 
        
            response.on("data",function(data){

                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const feels_like = weatherData.main.feels_like;
                const pressure = weatherData.main.pressure;
                const humidity = weatherData.main.humidity;
                const lat = weatherData.coord.lat;
                const lon = weatherData.coord.lon;
                const desc = weatherData.weather[0].description;
                const id = weatherData.weather[0].icon;
                const imgid = "http://openweathermap.org/img/wn/"+id+"@4x.png";


                res.render("response",{weatherData:weatherData,temp:temp,desc:desc,imgid:imgid,query:query,feels_like:feels_like,pressure:pressure,humidity:humidity,lat:lat,lon:lon}); 
            })
        }); 
    }
})


app.listen(3000,function(){
    console.log("Server is running on port 3000")
})