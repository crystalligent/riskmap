'use strict';
const mongoose = require('mongoose');
const evacuation = require('../controllers/evacuation');
module.exports = (app)=>{

app.get("/api/evacuation/getall",(req,res)=>{
    evacuation.getall(req,res);
});


app.get("/api/evacuation/getbyid",(req,res)=>{
    evacuation.getbyid(req,res);
});

}