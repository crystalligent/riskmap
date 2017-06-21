'use strict';
const mongoose = require('mongoose');
const weathercompany = require('../controllers/weathercompany');
module.exports = (app)=>{

app.get("/api/getlocation",(req,res)=>{
    weathercompany.getlocation(req,res);
});

app.get("/api/15dayshourlyforecast",(req,res)=>{
    weathercompany.get15dayshourlyforecast(req,res);
});

app.get("/api/get15daysmosquetoactivity",(req,res)=>{
    weathercompany.get15daysmosquetoactivity(req,res);
});

app.get("/api/get3daysmosquetoactivity",(req,res)=>{
    weathercompany.get3daysmosquetoactivity(req,res);
});

app.post("/api/reversegeobyshapes",(req,res)=>{
    weathercompany.reversegeobyshapes(req,res);
});

app.get("/api/getbarangaybyname",(req,res)=>{
    weathercompany.getBarangayByName(req,res);
})






var  getCenter =  function(arr){
        var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = []
    for(var i=0; i<arr.length; i++) {
      lngs.push(arr[i][0]);
      lats.push(arr[i][1]);
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[arr.length - 1];
    lowy = lngs[0];
    highy = lngs[arr.length - 1];
    var center_x = lowx + ((highx-lowx) / 2);
    var center_y = lowy + ((highy - lowy) / 2);


        return {lat:center_x,lng:center_y}
}

app.get("/getcenter5552e61ace2459bbdd6d7d54",function(req,res){
    var locations =  mongoose.model("Location");
    locations.find({"loc_type_desc":"Barangay"}).exec(function(err,docs){        
            console.log(err);
            console.log("processing barangay location");

            var icount=0;
            var dd =  docs[icount];
            var recursave =  function(doc){
                console.log("total:" + docs.length + "  "  +icount);
                if(docs.length==icount){
                    //res.status(200).json({"status":"done"});
                    return; 
                }
                console.log(icount + "  " + doc.brgy_name);

                var coords = doc.boundary.coordinates[0];            
                var center = getCenter(coords); 
                doc.coordinates = [];
                doc.coordinates.push(parseFloat(center.lng));
                doc.coordinates.push(parseFloat(center.lat));
                doc.coordbounds = [];
                doc.coordbounds = coords;
                for(var i=0;i<coords.length;i++){
                    var points = coords[i];
                    doc.coordbounds.push(points);
                };

                doc.save(function(){
                    icount+=1;
                    var aa = docs[icount];
                    recursave(aa);
                });
            }        
        
        recursave(dd);
        res.status(200).json({"status":"done"});
        return;        
    });



})





}
