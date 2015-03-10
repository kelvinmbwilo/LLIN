/**
 * Created by kelvin on 3/2/15.
 */
angular.module("malariaApp")
    .controller("importCtrl",function ($scope, $upload,$mdDialog,$mdToast) {
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.progressParcent = 0;
        $scope.upload = function (files) {
            $scope.data.imported = [];
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
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
                        console.log('progress: ' + progressPercentage + '% ' +
                            evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        $scope.progressParcent = 0;
                        $scope.data.toImport = data.length;
                        $scope.data.imported = data;
                        $scope.data.duplicates = data.duplicates;
                        $scope.data.newValues = data.newValue;
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