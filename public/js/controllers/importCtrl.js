/**
 * Created by kelvin on 3/2/15.
 */

angular.module("malariaApp")
    .controller("importCtrl",function ($scope, $upload,$mdDialog,$mdToast) {
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.summaryReady = false;
        $scope.proccessing  = false;
        $scope.progressParcent = 0;
        $scope.data.imported = [];
        $scope.upload = function (files) {
            $scope.data.imported = [];
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $scope.proccessing = true;
                    $upload.upload({
                        url: 'index.php/upload',
                        file: file,
                        fields: {
                            region:$scope.currentKaya.region,
                            ward:$scope.currentKaya.ward,
                            district:$scope.currentKaya.district,
                            village:$scope.currentKaya.village
                        }
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progressParcent = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        $scope.files = null;
                        $scope.currentKaya.village = {};
                        $scope.progressParcent = 0;
                        $scope.data.toImport = data.length;
                        $scope.data.imported = data;
                        $scope.data.duplicates = data.duplicates;
                        $scope.data.newValues = data.newValue;
                        $scope.summaryReady = true;
                        $scope.proccessing  = false;
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Coupons Imported Successfully!')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                        );
                    });
                }
            }
        };
    });