/**
 * Created by kelvin on 1/19/15.
 */
angular.module("malariaApp")
    .controller("distributeCtrl",function($scope,$http,$mdDialog,$mdToast){
        angular.element('#voucher_no').focus();
        $scope.data = {};
        $scope.data.kayaId = "";
        $scope.checkingKaya = false;
        $scope.performingDistribution = false;
        $scope.currentKayaPresent = true;
        $scope.currentKayaVerified = true;
        $scope.errorcheckingKaya = false;
        $scope.errorcheckingVKaya = false;
        $scope.checkKaya = function(id){
            $scope.checkingKaya = true;
            $scope.performingDistribution = false;
            $http.get("index.php/kaya/"+id).success(function(kaya){
                $scope.checkingKaya = false;
                console.log(kaya)
              if(kaya){
                  $scope.getWarg(kaya);
                  $scope.errorcheckingKaya = false;
                  $scope.currentKaya = kaya;
                  $scope.currentKayaPresent = false;
                  if(kaya.entry == "imported" && kaya.verification_status == 0){
                      $scope.currentKayaVerified = false;
                  }else{
                      $scope.currentKayaVerified = true;
                      $scope.errorcheckingVKaya = true;
                  }
               }else{
                  $scope.currentKaya = {};
                  $scope.errorcheckingKaya = true;
                  $scope.currentKayaPresent = true;
                  $scope.currentKayaVerified = true;
              }
            }).error(function(){
                $scope.currentKaya = {};
                $scope.errorcheckingKaya = true;
                $scope.checkingKaya = false;
                $scope.currentKayaPresent = true;
                $scope.currentKayaVerified = true;
            })
        }

        $scope.distributeKaya = function(id){
            $scope.performingDistribution = true;
            $http.post("index.php/kaya/"+id+"/distribute").success(function(kaya){
                $scope.currentKaya = kaya;
                $scope.performingDistribution = false;
                $mdToast.show(
                    $mdToast.simple()
                        .content('Coupons Redeemed Successfully!')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
            });
        }

        $scope.confirmVericationKaya = function(id){

            $http.post("index.php/kaya/"+id+"/verify").success(function(kaya){
                $scope.data.kayaId = null;
                $scope.currentKaya = {};
                $scope.currentKayaPresent = true;
                $mdToast.show(
                    $mdToast.simple()
                        .content('Coupons Verified Successfully!')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
            });
        }

        $scope.getWarg = function(kaya){
            $http.get("index.php/warddd/"+kaya.ward).success(function(kaya){
                $scope.wardd =  kaya.name;
            })
            $http.get("index.php/regionn/"+kaya.region).success(function(kaya){
                $scope.regionn =  kaya.region;
            })
            $http.get("index.php/districtss/"+kaya.district).success(function(kaya){
                $scope.districtt =  kaya.district;
            })
            $http.get("index.php/villagee/"+kaya.village).success(function(kaya){
                $scope.villagee = kaya.name;
            })
        }

    });