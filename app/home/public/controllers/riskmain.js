angular.module('RISK').controller("RISKMAPController", function( $scope, $http,$rootScope,$window,$timeout,DialogService,utilities) {
$scope.instanceKey = 12081;
$scope.evacuations = [];
$scope.currentEvacuation = {};
$scope.currentEvacuation.details = {};
$scope.currentEvacuation.faultline = {};
$scope.currentEvacuation.elevation = {};

$scope.distanceline = null;
var _divIcon =  function(){            
        var icon = L.divIcon({className:"evacuation-image-marker",html:"<div class='evacuation'>" +  "" +"</div>"});                            
        return icon;
};
var _onMapdblclicked =  function(e){
        console.log(e);
        
};


var _onmarkerclicked =  function(e){
        var _data = e.target.options.markerData
        $http.get("/api/getnearestfaultline?lat=" + _data.coordinates[1] + "&lng=" + _data.coordinates[0]).success(function(data){
                console.log(data);
                $scope.currentEvacuation.faultline =  data;
                if(data.distance){                        
                        if($scope.distanceline){
                                $("#mainmap").leafletMaps("removeLayers",$scope.distanceline);
                        }
                        
                        
                        var points =[]
                        points.push(new L.LatLng(_data.coordinates[1], _data.coordinates[0]));
			points.push(new L.LatLng(data.latitude, data.longitude));
                                                
                        $("#mainmap").leafletMaps("getMap",function(map){
                                $scope.distanceline = L.polyline(points, {
                                        color: "#0000ff",
                                        weight: 2,
                                        opacity: 1,
                                        smoothFactor: 1
                                        }).addTo(map);                                        
                        });                        
                }

        });

        $http.get("/api/evacuation/getbyid?id="+_data._id).success(function(data){;
                console.log(data);
                $scope.currentEvacuation.details =  data;
        });

        $http.get("/api/getelevation?location=" +  _data.coordinates[1] + "," + _data.coordinates[0] ).success(function(data){;
                console.log(data);
                $scope.currentEvacuation.elevation =  data.status=="OK"? data.results[0]:{};
        });
}

$scope.tokm =  function(d){
        if(!d) return "";
        return (d /1000).toFixed(2) + "  KM"; 
};
$scope.tom =  function(d){
        if(!d) return "";
        return (d).toFixed(2) + "  Meter(s)"; 
};

$scope.init =  function(){
//api/getinstancekey        
$http.get("/api/getintancekeyfrompage").success(function(instancekey){
        $http.get("/common/data/current-wind-surface-level-gfs-1.0.json").success(function(data){
                $("#mainmap").leafletMaps({mutilplebasemap:true,instanceKey:instancekey,winddata:data});                                
                $("#mainmap").leafletMaps({"clusterGroup": new L.MarkerClusterGroup(),"onMapdblclicked":_onMapdblclicked});
                $("#mainmap").leafletMaps("addClusterGroup","evacuations",new L.MarkerClusterGroup());
        

                $http.get("/api/evacuation/getall").success(function(evacuations){
                $scope.evacuations = evacuations;
                if(evacuations.length==0){return;}            
                evacuations.forEach(function(r){
                        var _loc = r.coordinates; 
                        var marker = $("#mainmap").leafletMaps("addmarkerToCluster","evacuations",_divIcon(),[_loc[1],_loc[0]],r);

                        marker.bindPopup(r.name);
                        marker.on('mouseover', function (e) {
                        //e.layer.openPopup();
                                //e.layer.openPopup();
                                this.openPopup();
                        });
                        marker.on('click', _onmarkerclicked);
                        });
                });
        });
});        

                




}; // init()

});