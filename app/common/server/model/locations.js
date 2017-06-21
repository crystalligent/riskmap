'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
   _ = require('lodash');



var LocationSchema = new Schema({

  boundary : {
    type : Schema.Types.Mixed,
    index : '2dsphere'
  },
  coordbounds : {
    type : Schema.Types.Mixed,
    index : '2dsphere'
  },
  map_reg_name : {
    type : String
  },

  prov_name : {
    type : String
  },

  loc_name : {
    type : String
  },

  brgy_name : {
    type : String
  },

  loc_type_desc : {
    type : String
  },

  loc_cd : {
    type : String
  },

  luz_vi_min : {
    type : String
  },

  reg_name : {
    type : String
  },

  region_num : {
    type : String
  },

  reg_short : {
    type : String
  },
  population : {
    type : Number,
    max : 999999
  },
  population_incidence : {
    type : Number,
    max : 999999
  },
  coastal_landlocked : {
    type : String
  },
  coordinates : [Number],
  radius : {
    type : Number
  },
  ref_loc : {
    type : Schema.Types.ObjectId,
      ref : 'Location'
  },
  nearby30 : [{
    type : Schema.Types.ObjectId,
      ref : 'Location'
  }]

});

LocationSchema.virtual('map_loc_prov_name').get(function () {
  return this.loc_name + ', ' + this.prov_name;
});

LocationSchema.set('toJSON', { getters: true, virtuals: true });

LocationSchema.statics.reverseGeoCode = function(lon, lat, cb){
  return this.find({boundary:
                 {$geoIntersects:
                     {$geometry:{ 'type': 'Point',
                          'coordinates': [ lon, lat ] }
                      }
                  },$or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'} ]
             },{_id:1,map_reg_name:1,prov_name:1,loc_name:1,coordinates:1,loc_type_desc:1})
     .exec(cb);
};



LocationSchema.statics.reversegeobyshapes = function(option,cb){  
  var qry = {};

    if(option.type=="circle"){
      qry = {"coordinates": 
                  {
                    $geoWithin: { $centerSphere: [[option.coords[0],option.coords[1] ],  ((option.rad / 6378.1) / 1000)] }
                  }	
            }
    }else if(option.type=="polygon"){
            qry = {"coordinates": 
                                {
                                  $geoWithin: { $polygon:  option.coords  }
                                }	
                  }            
    }else if(option.type=="rectangle"){
          qry = {"coordinates": 
                                {
                                  $geoWithin: { $box: [
                                                       option.coords[0],
                                                       option.coords[1 ]
                                                      ]
                                            }
                              }	
                  }

  
    }else if(option.type=="marker"){
          qry = {boundary:
                 {$geoIntersects:
                     {$geometry:{ 'type': 'Point',
                          'coordinates': [ option.coords[0], option.coords[1] ] }
                      }
                  }
             }
    }


  qry.loc_type_desc="Barangay";
  //console.log(JSON.stringify(qry));
  return this.find(qry).select("_id brgy_name loc_name map_reg_name prov_name map_reg_name coordinates") .exec(cb); 
} 



/**
 * Will retrieve list of locations within a radius
 * from a given point
 *
 * @param point
 * [ lon, lat ] value of the point/center
 *
 * @param radius
 * Must be in kilometers
 */


LocationSchema.statics.getLocationsWithinRadius = function( point, radius, cb){
  return this.find({
          coordinates : {
              $geoWithin : { $centerSphere : [ point, radius/6378.1] }
          },
          $or : [
              { loc_type_desc : 'City' },
              { loc_type_desc : 'Municipality' }
          ]
      },
      {
          _id : 1,
          population : 1,
          nhts_population : 1,
          pantawid_population : 1
      })
     .exec(cb);
};

/**
 * Will retrieve list of locations within the given
 * polygon
 *
 * @param polygon
 * [ [ lon, lat ] ]

 */
LocationSchema.statics.getLocationsWithinPolygon = function( polygon, cb){
  return this.find({
          coordinates : {
              $geoWithin : { $polygon : polygon }
          },
          $or : [
              { loc_type_desc : 'City' },
              { loc_type_desc : 'Municipality' }
          ]
      },
      {
          _id : 1,
          population : 1,
          nhts_population : 1,
          pantawid_population : 1
      })
     .exec(cb);
};

LocationSchema.statics.reverseGeoCodeMinified = function(lon, lat, cb){
  return this.findOne({boundary:
                 {$geoIntersects:
                     {$geometry:{ 'type': 'Point',
                          'coordinates': [ lon, lat ] }
                      }
                  },$or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'} ]
             },{_id:1,coordinates:1,prov_name:1,loc_name:1,loc_type_desc:1})
     .exec(cb);
};

LocationSchema.statics.reverseGeoCodeMinifiedForWatershed = function(lon, lat, cb){
  return this.find({boundary:
                 {$geoIntersects:
                     {$geometry:{ 'type': 'Point',
                          'coordinates': [ lon, lat ] }
                      }
                  }, loc_type_desc : "Watershed"
             })
     .exec(cb);
};

LocationSchema.statics.findAllMunicities = function(cb){
 return this.find({$or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'} ]
             },{_id:1,reg_name:1,prov_name:1,loc_name:1,coordinates:1,loc_type_desc:1})
     .exec(cb);
};


LocationSchema.statics.getAllMunicities = function(cb){
 return this.find({$or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'} ]
             },{_id:1,reg_name:1,prov_name:1,loc_name:1,coordinates:1,loc_type_desc:1,boundary:1})
     .exec(cb);
};

LocationSchema.statics.getAllProvinces = function(cb){
 return this.find({"loc_type_desc":"Province"},{_id:1,reg_name:1,prov_name:1,map_reg_name:1})
     .exec(cb);
};


LocationSchema.statics.findAllTouristSpots = function(cb){
  return this.find({loc_type_desc : "Tourist Spot"},{_id:1,reg_name:1,prov_name:1,loc_name:1,coordinates:1,loc_type_desc:1,ref_loc:1})
     .populate('ref_loc','coordinates prov_name loc_name loc_type_desc')
     .exec(cb);
};

LocationSchema.statics.findByCode = function(locationCode, cb) {
  return this.findOne({
    loc_cd: locationCode
  }).exec(cb);
};

LocationSchema.statics.findByCodeForClimate = function(map_reg_name, prov_name, loc_name, cb){
  return this.findOne({
    reg_name : map_reg_name,
    prov_name : prov_name,
    loc_name : loc_name,
    $or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'} ]
  }).exec(cb);
};

LocationSchema.statics.load = function(id, cb) {
  return this.findOne({
    _id: id
  }).exec(cb);
};

LocationSchema.statics.loadMinified = function(id, cb) {
  return this.findOne({
    _id: id
  },{coordinates : 1, prov_name : 1, loc_name : 1,loc_type_desc:1}).exec(cb);
};

LocationSchema.statics.loadMinifiedWithNearby = function(id, cb) {
  return this.findOne({
    _id: id
  },{coordinates : 1, prov_name : 1, loc_name : 1, loc_type_desc:1, nearby30 : 1}).exec(cb);
};

LocationSchema.statics.findWithinRadiusWithDistance = function(lon,lat,radius,cb){
  return this.find({
     boundary:
       { $near :
          {
            $geometry: { type: 'Point',  coordinates: [ lon, lat ] },
            $maxDistance: radius*1000
          }
       },$or : [{ loc_type_desc : 'City'}, { loc_type_desc : 'Municipality'}]
   }).exec(cb);
};

LocationSchema.statics.reverseGeoToMunicity = function(lon, lat, cb){
  return this.find({boundary:
                 {$geoIntersects:
                     {$geometry:{ 'type': 'Point',
                          'coordinates': [ lon, lat ] }
                      }
                  },
                  $or : [{loc_type_desc : 'City'}, {loc_type_desc : 'Municipality' }]
             },{_id:1,map_reg_name:1,prov_name:1,loc_name:1})
     .exec(cb);
};

// WITH SAME FUNCTION NAME IN WEDA
LocationSchema.statics.getRegionGeoJson = function(regions,cb){
  return this.find({map_reg_name : { $in : regions},loc_type_desc : 'Region'}).exec(cb);
};

// WITH SAME FUNCTION NAME IN WEDA
LocationSchema.statics.getProvinceGeoJson = function(regions,cb){
  return this.find({map_reg_name : regions, loc_type_desc : 'Province'}).exec(cb);
};

// WITH SAME FUNCTION NAME IN WEDA
LocationSchema.statics.getMunicityGeoJson = function(province,regions,cb){
  return this.find({map_reg_name : regions, prov_name : province,  $or : [{loc_type_desc : 'City'}, {loc_type_desc : 'Municipality' }]}
                  ,{_id:1,reg_name:1,prov_name:1,loc_name:1,coordinates:1,loc_type_desc:1,boundary:1}).exec(cb);
};

LocationSchema.statics.getGeoJsonfromPublicProjectLocation=function(project,cb){
  var locations =project.project.scenarios[0].typhoon_track.tracks[0].affected_population.location;
   var self =this;
   var buildIDs = function(loc,callback){
     var ids = [];
     for(var i=0;i<locations.length;i++){ids.push(ObjectId(loc[i].location_id.toString()));}
     callback(ids);
   }
   buildIDs(locations,function(arr){
     self.find({
          _id: { $in :arr
      }
      }, function(err, docs){
           cb(docs);
      });


   });
};

LocationSchema.statics.getMunicipalityByName = function(_name_,cb){
   var r = new RegExp(_name_,'i');
  this.find({loc_name: {$regex:r},$or: [ { loc_type_desc : 'Municipality' } ,{ loc_type_desc: 'City' }]})
  .select('_id loc_name coordinates loc_type_desc prov_name map_reg_name')
  .exec(cb);
};


LocationSchema.statics.getBarangayByName = function(_name_,cb){
   var r = new RegExp(_name_,'i');
  this.find({brgy_name: {$regex:r},loc_type_desc: 'Barangay' })
  .select('_id brgy_name loc_name coordinates loc_type_desc prov_name')
  .limit(50)
  .exec(cb);
};

LocationSchema.statics.findReverseGeoCodeThenNear = function(lon,lat,radius,cb){
  mongoose.model('Location').reverseGeoCode(lon,lat,function(err,location){
    if(err){
      mongoose.model('Location').findWithinRadiusWithDistance(lon,lat,radius,function(err,loc){
        if(err){
          var error = {msg : 'Failed to retrieve a location.', err : 'Cannot find a location with the given lat and lng.'};
          cb(error,null);
        }else{
          cb(null,loc);
        }
      });
    }else{
      if(location.length === 0){
        mongoose.model('Location').findWithinRadiusWithDistance(lon,lat,radius,function(err,loc){
          if(err){
            var error = {msg : 'Failed to retrieve a location.', err : 'Cannot find a location with the given lat and lng.'};
            cb(error,null);
          }else{
            cb(null,loc);
          }
        });
      }else{
        cb(null,location);
      }
    }
  });
};

LocationSchema.statics.getRegionProvince = function(cb){
  this.find({"loc_type_desc": {$in:["Province","Region"]}})
  .select('_id loc_name coordinates loc_type_desc prov_name map_reg_name boundary boundary_lowres')
  .exec(function(err,resultVal){
         var _regions = [];
         var arr = _(resultVal)
              .groupBy(function(n){
                return n.map_reg_name;
              }).transform(function(result,val,key){
                var provinces = [];
                val.forEach(function(vals){
                   if(vals.map_reg_name==key && vals.prov_name){
                        provinces.push(vals);
                   }
                });

                provinces.sort(function(a, b){
                    var keyA = a.prov_name,
                    keyB = b.prov_name;
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                });

                var regions = resultVal.filter(function(value){
                            return (value.loc_type_desc.indexOf("Region")>-1);
                        });

                
                var indexID = regions.map(function(d){return d.map_reg_name}).indexOf(key);
                var regionObj = (indexID>-1)?regions[indexID]:"-1";
                
                //console.log(regionObj.toString());

                var aa = JSON.parse(JSON.stringify(regionObj));
                  //console.log(aa.boundary_lowres)

                _regions.push({"region":key,
                              "region_id":regionObj._id, 
                              "boundary_lowres": aa.boundary_lowres,
                              "provinces": provinces});

                _regions.sort(function(a, b){
                    var keyA = a.region,
                    keyB = b.region;
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                })
              })
              .valueOf();
             cb(err,_regions);
  });
};


mongoose.model('Location', LocationSchema);
