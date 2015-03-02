/**
 * Created by kelvin on 3/2/15.
 */
angular.module("malariaApp")
    .controller("searchCtrl",function ($scope, $http) {
        $scope.currentKaya = {};
        $scope.currentKaya.ward = null;
        $scope.showtable = false;
        $scope.currentKaya.village = null;
        $scope.kaya =[];
        $scope.search = function(currentKaya){

            console.log(currentKaya);
            $http.post("index.php/search/kaya",currentKaya).success(function(data){
                $scope.kaya = data ;
                $scope.showtable = true;
            });
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