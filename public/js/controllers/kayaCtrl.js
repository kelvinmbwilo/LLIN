/**
 * Created by kelvin on 1/13/15.
 */
angular.module("malariaApp")
    .controller("kayaCtrl",function($scope,$http){
       $scope.currentKaya = {};
        $scope.currentSaving = false;
        $scope.currentUpdating = false;
        $scope.currentEditting = false;
        $scope.kayaSavedSuccess = false;
        $scope.kayaUpdatedSuccess = false;
        $scope.kayaSavedFalue = false;
        $scope.kayaUpdateFalue = false;
//       $scope.currentKaya.uid = parseInt(Math.random()*1000000);
       $scope.currentKaya.uid = 0;




        $scope.saveKaya = function(kaya){
            $scope.currentSaving = true;
            $http.post("index.php/kaya", kaya).success(function (newKaya) {
//                $scope.data.kaya.push(newKaya);
                $scope.currentKaya = {};
//                $scope.currentKaya.uid = parseInt(Math.random()*1000000);
                $scope.currentKaya.uid = 0;
                $scope.kayaSavedSuccess = true;
                $scope.currentSaving = false;
                $scope.kayaSavedFalue = false;
            }).error(function(){
                $scope.kayaSavedSuccess = false;
                $scope.currentSaving = false;
                $scope.kayaSavedFalue = true;
            });
        }

        $scope.enableEdit = function(kaya){
            $scope.currentKaya = kaya;
            $scope.currentEditting = true;
            $scope.kayaUpdatedSuccess = false;
            $scope.currentUpdating = false;
            $scope.kayaUpdateFalue = false;
            $scope.kayaSavedSuccess = false;
        }

        $scope.cancelEditting = function(){
            $scope.currentKaya = {};
            $scope.currentEditting = false;
            $scope.kayaUpdatedSuccess = false;
            $scope.currentUpdating = false;
            $scope.kayaUpdateFalue = false;
//            $scope.currentKaya.uid = parseInt(Math.random()*1000000);
            $scope.currentKaya.uid = 0;
        }

        $scope.updateKaya = function(kaya){
            $scope.currentUpdating = true;


            $http.post("index.php/kaya/"+kaya.id, kaya).success(function (newKaya) {
                for (var i = 0; i < $scope.data.kaya.length; i++) {
                    if ($scope.data.kaya[i].id == newKaya.id) {
                        $scope.data.kaya[i] = newKaya;
                        break;
                    }
                }
                $scope.kayaUpdatedSuccess = true;
                $scope.currentUpdating = false;
                $scope.kayaUpdateFalue = false;
            }).error(function(){
                $scope.kayaUpdatedSuccess = false;
                $scope.currentUpdating = false;
                $scope.kayaUpdateFalue = true;
            })

        }

        $scope.currentDelete = [];
        $scope.deleteSuccess = [];
        $scope.enableDelete = function(kaya){
            $scope.currentDelete = [];
            $scope.currentDelete[kaya.id] = true;
            $scope.deleteSuccess = [];
        }
        $scope.cancelDelete = function(kaya){
            $scope.currentDelete = [];
            $scope.deleteSuccess = [];
        }

        $scope.deleteKaya = function(kaya){
            $scope.deleteSuccess [kaya.id] = true;
            $scope.currentDelete = [];
            $http.post("index.php/kaya/delete/"+kaya.id).success(function () {
                $scope.data.kaya.splice($scope.data.kaya.indexOf(kaya), 1);
                $scope.currentDelete = [];
                $scope.deleteSuccess = [];
            });
        }



    })