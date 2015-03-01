/**
 * Created by kelvin on 1/19/15.
 */
angular.module("malariaApp")
    .controller("distributeCtrl",function($scope,$http){
        angular.element('#voucher_no').focus();
        $scope.checkingKaya = false;
        $scope.performingDistribution = false;
        $scope.currentKayaPresent = true;
        $scope.errorcheckingKaya = false;
        $scope.checkKaya = function(id){
            $scope.checkingKaya = true;
            $scope.performingDistribution = false;
            $http.get("index.php/kaya/"+id).success(function(kaya){
                $scope.checkingKaya = false;
              if(kaya){
                  $scope.errorcheckingKaya = false;
                  $scope.currentKaya = kaya;
                  $scope.currentKayaPresent = false;

               }else{
                  $scope.currentKaya = {};
                  $scope.errorcheckingKaya = true;
                  $scope.currentKayaPresent = true;
              }
            }).error(function(){
                $scope.currentKaya = {};
                $scope.errorcheckingKaya = true;
                $scope.checkingKaya = false;
                $scope.currentKayaPresent = true;
            })
        }

        $scope.distributeKaya = function(id){
            $scope.performingDistribution = true;
            $http.post("index.php/kaya/"+id+"/distribute").success(function(kaya){
                $scope.currentKaya = kaya;
                $scope.performingDistribution = false;
            })
        }

        $scope.confirmVericationKaya = function(id){
            alert("Coupon with code number "+ id +" has been Verified");
            $scope.data.kayaId = null;
            $scope.currentKaya = {};
            $scope.currentKayaPresent = true;
        }
    });