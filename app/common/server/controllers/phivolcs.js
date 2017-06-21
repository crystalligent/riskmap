'use strict';
const mongoose = require('mongoose');
const request = require('request');
//const curl = require('curlrequest');
const querystring = require( 'querystring' );
var Curl = require( 'node-libcurl' ).Curl;
 var curl = new Curl();
 

var _INTANCEKEY = 12081 //34615 //49554 //43680;

var  MyIntNum = function(a, b) {
        a = Math.ceil(a);
        b = Math.floor(b);
        return Math.floor(Math.random() * (b - a)) + a
    };
   
var getVersion =  function(){
    return Math.ceil(100 * Math.random()) + 1;
} 

var _requestcurl =  function(req,cb){
    console.log(req.query);
    const _longitude = req.query.lng || 120.87711467009276;
    const _latitude = req.query.lat || 15.233741712079504;
    const _fault_map_mode =1;
    const _flag = MyIntNum(2,100); 
    _requestPhivolcsPage(function(err,data){
            var _str = data.toString().split("vstatus=")[1];
            _str = _str.split(";")[0] || "";
        _INTANCEKEY = _str || _INTANCEKEY;
        const _old_fault_mode = _flag * _INTANCEKEY;

        var curl = new Curl(),url  = "http://faultfinder.phivolcs.dost.gov.ph/mysystem/myfault/scripts/get_my_fault_new.php",
        _dataOptions = {version:getVersion(),
                                longitude:_longitude,
                                latitude:_latitude,
                                fault_map_mode:_fault_map_mode,
                                flag:_flag,
                                old_fault_mode:_old_fault_mode},
        data = querystring.stringify( _dataOptions );

        curl.setOpt( Curl.option.URL, url );
        curl.setOpt( Curl.option.POSTFIELDS, data );
        curl.setOpt( Curl.option.HTTPHEADER, ['Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                'Accept-Encoding:gzip, deflate',
                                'Accept-Language:en-US,en;q=0.5', 
                                'Content-Type:application/x-www-form-urlencoded', 
                                'Host:faultfinder.phivolcs.dost.gov.ph', 
                                'Referer:http://faultfinder.phivolcs.dost.gov.ph/', 
                                'User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0']);
        curl.setOpt( Curl.option.VERBOSE, true );
        curl.perform();
        curl.on( 'end', function( statusCode, body ) {    
            this.close();
            console.log(body);
            cb(null,body);
            return false;;
        });

        curl.on( 'error', curl.close.bind( curl ) );                                
            
    }); //end request page;
   /*
   mongoose.model('instancekey').getkey(function(err,data){
       
        
   }); //end getKey
   */
} //end curl


var _requestPhivolcsPage =  function(done){
    request({
        url: "http://faultfinder.phivolcs.dost.gov.ph/",
        method: "GET",
        headers: {            
            "Accept": "*/*"
        }
    }, function(err, req, data) {
        if (err) {
            done(err);
        } else {
            if (req.statusCode >= 200 && req.statusCode < 400) {
                try {
                    done(null, data);
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


var _sendRequest =  function(_,qs,done){
    request({
        url: _,
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


exports.getnearestfaultline =  (req,res)=>{    
    // /_sendRequest 
     _requestcurl(req,function(err,data){
        if (err) {            
            res.send(err).status(400);
        } else {        	
            var _data = data||"{}";
            //console.log(_data);
            res.status(200).json(JSON.parse(_data));
        }
    });

}

exports.getelevation =  (req,res)=>{
    var loc = req.query.location || "";    
    var qs = {"locations":loc,
             "key":"AIzaSyANYOzL72BR6eF7f2BC6u42aTXDKrD1iq8"}
     
     _sendRequest("https://maps.googleapis.com/maps/api/elevation/json",qs,function(err,data){
        if (err) {            
            res.send(err).status(400);
        } else {        	
            var _data = data|| {};
            res.status(200).json(_data);
        }
    });
}

exports.getinstancekey =  (req,res)=>{
    mongoose.model('instancekey').getkey(function(err,data){
            if (err) {            
            res.send(err).status(400);
        } else {        	
            var _data = data|| 0;
            res.status(200).json(_data);
        }
    })
    
}



exports.getintancekeyfrompage =  (req,res)=>{
    _requestPhivolcsPage(function(err,data){
            var _str = data.toString().split("vstatus=")[1];
            _str = _str.split(";")[0] || "";                                
            res.send(_str).status(200);
    });
}