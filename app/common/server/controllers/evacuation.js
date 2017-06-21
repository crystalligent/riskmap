'use strict';
const mongoose = require('mongoose');
const request = require('request');


exports.getall =  (req,res)=>{
    var evacuation =  mongoose.model("evacuation");
    evacuation.getall(function(err,data){
        if (err) {            
            res.send(err).status(400);
        } else {        	           
            res.status(200).json(data);
        }
    });
}

exports.getbyid =  (req,res)=>{
    var evacuation =  mongoose.model("evacuation");
    var _id = req.query.id;
    evacuation.getbyid(_id,function(err,data){
        if (err) {            
            res.send(err).status(400);
        } else {        	           
            res.status(200).json(data);
        }
    });
}