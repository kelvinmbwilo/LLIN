/**
 * Created by kelvin on 1/21/15.
 */
angular.module("malariaApp")
    .controller('listCtrl',function($scope,$http){
        $scope.showList =false;
        $scope.getList = function(currentKaya){
            $scope.showList =false;
            $http.post("index.php/getkaya",currentKaya).success(function(res){
                $scope.data.kaya = res;
                $scope.showList =true;
            });
        }
    });