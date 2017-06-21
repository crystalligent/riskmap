(function(){
var app = angular.module("RegisterModule",[]);
    app.controller("RegisterController", function( $scope,$rootScope, $http ) {
      $scope.processing = true;
      $scope.user = {};
      $scope.registerError = [];      
      $scope.locationresults = [];


      $scope.onlocationchange =  function(){
             var a = $("#txtsearch").val();
              $http.get("/api/getbarangaybyname?loc=" + a).success(function(locations){
                    $scope.locationresults = locations;                        
                });
      };


      $scope.onclicklocation =  function(e){
          console.log(e);
          $("#txtsearch").val(e.brgy_name + " " + e.map_loc_prov_name);

          $scope.user.location = e;
          $scope.locationresults = [];
      }
      $scope.Register = function(){
           $http.post('/register', {
            email: $scope.user.email,
            password: $scope.user.password,
            confirmPassword: $scope.user.confirmPassword,
            name: $scope.user.name,
            location:$scope.user.location,
            mobile:$scope.user.mobile
            })
          .success(function() {
            // authentication OK
            $scope.registerError = [];
            window.location.href="/login";            
          })
          .error(function(error) {
            if (error === 'Email already taken') {
               $scope.emailError = error;
            } else $scope.registerError = error;            
          });

        
        
      };

      
  });

})();