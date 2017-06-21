'use strict';
const mongoose = require('mongoose');
const request = require('request');
const API_CREDENTIAL="f31b48eeb08b4978347f706bdb4abc64";
const weather_host = "https://api.weather.com";


function weatherAPI(path, qs, done) {
    var url = weather_host + path;
    console.log(url, qs);
    request({
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        qs: qs
    }, function(err, req, data) {
        if (err) {
            done(err);
        } else {
            if (req.statusCode >= 200 && req.statusCode < 400) {
                try {
                    done(null, JSON.parse(data));
                } catch(e) {
                    console.log(e);
                    done(e);
                }
            } else {
                console.log(err);
                done({ message: req.statusCode, data: data });
            }
        }
    });
}

exports.get15daysmosquetoactivity =  (req,res)=>{
var geocode = (req.query.geocode || "45.43,-75.68").split(",");
var _keylocation = req.query.keylocation; 
 weatherAPI("/v2/indices/mosquito/daily/15day?geocode=" + geocode[0] + "," + geocode[1] + "&language=en-US&format=json&apiKey=" + API_CREDENTIAL, {
        language: req.query.language || "en",
        apiKey:API_CREDENTIAL
    }, function(err, result) {
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {        	
            res.json({forecast:result,key:_keylocation});
        }
    });
};

exports.get3daysmosquetoactivity =  (req,res)=>{
var geocode = (req.query.geocode || "45.43,-75.68").split(",");
var _keylocation = req.query.keylocation; 
 weatherAPI("/v2/indices/mosquito/daily/3day?geocode=" + geocode[0] + "," + geocode[1] + "&language=en-US&format=json&apiKey=" + API_CREDENTIAL, {        
        apiKey:API_CREDENTIAL
    }, function(err, result) {
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {        	
            res.json({forecast:result,key:_keylocation});
        }
    });
};




exports.get15dayshourlyforecast = (req,res)=>{
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");
    var _keylocation = req.query.keylocation;        
    weatherAPI("/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/hourly/360hour.json", {
        units: req.query.units || "m",
        language: req.query.language || "en",
        apiKey:API_CREDENTIAL
    }, function(err, result) {
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {        	
            res.json({forecast:result.forecasts,key:_keylocation});
        }
    });
}



exports.getlocation = (req,res)=>{
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");    
    weatherAPI("/v3/location/point?geocode=" + geocode[0] + "," + geocode[1] + "&language=en-US&format=json&apiKey=" + API_CREDENTIAL ,
    {},function(err, result) {
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {        	
            res.json(result);
        }
    });
}

exports.reversegeobyshapes = (req,res)=>{
    const location = mongoose.model("Location");
    var option = {};
        option.type = req.body.type;
        option.coords = req.body.coords;
        option.rad = req.body.rad || null;         
        console.log(option);

    location.reversegeobyshapes(option,(err,docs)=>{
        if(err){
            console.log(err);
                res.status(500).json({"error":"query error"});
        }else{
            res.status(200).json(docs);
        }
    })

}

exports.getBarangayByName=(req,res)=>{
        const location = mongoose.model("Location");
        var loc =  req.query.loc || false;
        if(!loc) {res.status(200).json([]);return;};
        location.getBarangayByName(loc,function(err,docs){
            if(err){ res.status(500).json(err);return;}
            res.status(200).json(docs);
        });
} 