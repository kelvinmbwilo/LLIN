/**
 * Created by kelvin on 3/2/15.
 */
angular.module("malariaApp")
    .controller("searchCtrl",function ($scope, $http) {
        $scope.search = function(currentKaya){
            if(currentKaya.ward && currentKaya.ward == ""){
                alert("ward empty")
            }
            console.log(currentKaya);
        }

        $scope.getWards = function(id){
            $scope.currentKaya.ward = null;
            $http.get("index.php/wards/district/"+id).success(function(distr){
                $scope.data.disward = distr;
            });
        }

        $scope.getVillages = function(id){
            $scope.currentKaya.village = null;
            $http.get("index.php/village/ward/"+id).success(function(distr){
                $scope.data.disvillage = distr;
            });
        }
    });