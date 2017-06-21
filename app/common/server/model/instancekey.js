'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
   _ = require('lodash');

const instanceKeySchema = new Schema({
    key:Number         
},{ collection: 'instancekey' });




instanceKeySchema.statics.getkey = function(cb){
    this.findOne({}).select({"key":1,"_id":0}).exec(function(err,data){
                cb(err,data);
    }) ;  
};


mongoose.model('instancekey',instanceKeySchema );

