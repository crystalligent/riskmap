'use strict';

 var mongoose  = require('mongoose'),
 Schema    = mongoose.Schema,
 ObjectId = mongoose.Types.ObjectId,
 _  = require('lodash');
/**
 * Warehouse Schema structure
 */
var EvacuationSchema = new Schema({
  location_id : {
    type : Schema.Types.ObjectId,
    ref : 'Location'
  },
  coordinates : [Number],
  name: {
      type: String
  },
  name_key : {
    type : String,
    required: true,
    lowercase: true
  },
  capacity :{
    type:Number
  },
  address : {
  	type : String,
  	required : true
  },
  evacuation_type:{
    type : String
  },
  manager : {
    type : String,
    required : true
  },
  contact : {
    type : String    
  },
  create_date : {
    type : Date
  },
  person : [{}]
});

 EvacuationSchema.pre('save', function(next) {
  var hasError = {};
  
  if(this.coordinates == null){
      return next(new Error('Coordinates is null'));
  }

  if(this.capacity == null){
      return next(new Error(' Capacity is null'));
  }
  next();
});



EvacuationSchema.statics.getbyid = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate("location_id", ["loc_name","prov_name","reg_name"])
  .exec(function(err,result){
    if(result === null){
      return cb(new Error('Failed to load evacuation'));
    }else{
      return cb(err,result);
    }
  });
};

EvacuationSchema.statics.getall = function(cb) {
  this.find({}).select({_id:1,name:1,coordinates:1}).exec(function(err,result){
    if(result === null){
      return cb(new Error('Failed to load evacuation'));
    }else{
      return cb(err,result);
    }
  });};

mongoose.model('evacuation', EvacuationSchema);
