'use strict';
const mongoose = require('mongoose');
const phivolcs = require('../controllers/phivolcs');
module.exports = (app)=>{

app.get("/api/getnearestfaultline",(req,res)=>{
    phivolcs.getnearestfaultline(req,res);
});

app.get("/api/getelevation",(req,res)=>{
    phivolcs.getelevation(req,res);
});

app.get("/api/getinstancekey",(req,res)=>{
    phivolcs.getinstancekey(req,res);
});
 
app.get("/api/getintancekeyfrompage",(req,res)=>{
    phivolcs.getintancekeyfrompage(req,res);
});
 
}