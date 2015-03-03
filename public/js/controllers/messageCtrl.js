/**
 * Created by kelvin on 3/3/15.
 */
/**
 * Created by kelvin on 3/1/15.
 */
angular.module("malariaApp")
    .controller("messageCtrl",function($scope,$http,$mdDialog,$mdToast,$animate){
        $scope.currentKaya = {};
        $scope.currentSaving = false;
        $scope.currentUpdating = false;
        $scope.currentEditting = false;
        $scope.kayaSavedSuccess = false;
        $scope.kayaUpdatedSuccess = false;
        $scope.kayaSavedFalue = false;
        $scope.kayaUpdateFalue = false;
        $scope.showEditAdd = false;

        $http.get("index.php/messages_receivers/").success(function(data){
            $scope.recipients = data;
        });


        $scope.saveUser = function(user){
            $scope.currentSaving = true;
            $http.post("index.php/messages_receivers", user).success(function (newUser) {
                $scope.recipients.push(newUser);
                $scope.currentKaya = {};
                $scope.kayaSavedSuccess = true;
                $scope.currentSaving = false;
                $scope.kayaSavedFalue = false;
                $mdToast.show(
                    $mdToast.simple()
                        .content('User Created Successfully!')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
                $scope.showEditAdd = false;
            }).error(function(){
                $scope.kayaSavedSuccess = false;
                $scope.currentSaving = false;
                $scope.kayaSavedFalue = true;
            });
        }

        $scope.showAEdit = function(user){
            $scope.showEditAdd = true;
            $scope.currentEditting = true;
            $scope.currentKaya = user;
        }

        $scope.showAdd = function(){
            $scope.showEditAdd = true;
            $scope.currentEditting = false;
            $scope.currentKaya = {};
        }

        $scope.cancelEditting = function(){
            $scope.showEditAdd = false;
            $scope.currentEditting = false;
            $scope.currentKaya = {};
        }

        $scope.cancelAdding = function(){
            $scope.showEditAdd = false;
            $scope.currentKaya = {};
        }

        $scope.updateUser = function(user){
            $scope.currentUpdating = true;
            $http.post("index.php/messages_receivers/"+user.id, user).success(function (newUser) {
                for (var i = 0; i < $scope.recipients.length; i++) {
                    if ($scope.recipients[i].id == newUser.id) {
                        $scope.recipients[i] = newUser;
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
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: false,
            right: true
        };

        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };

        $scope.deletedUser = [];
        $scope.deletingdUser = [];
        $scope.showConfirm = function(ev,id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this item')
                .content('This action is irreversible')
                .ariaLabel('Lucky day')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.deletingdUser[id] = true;
                $http.post("index.php/delete/recipients/"+id).success(function (newVal) {
                    $scope.deletedUser[id] = true;
                    $mdToast.show(
                        $mdToast.simple()
                            .content('User Deleted Successfully!')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                    );
                });
            }, function() {

            });
        };
    });
