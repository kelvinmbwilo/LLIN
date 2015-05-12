/**
 * Created by kelvin on 3/3/15.
 */
angular.module("malariaApp")
    .controller("timelineCtrl",function($scope,$http,$mdDialog,$mdToast,$animate){
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            dateFormat: 'mm-dd-yy'
        };
        $scope.currentKaya = {};
        $scope.currentSaving = false;
        $scope.currentUpdating = false;
        $scope.currentEditting = false;
        $scope.kayaSavedSuccess = false;
        $scope.kayaUpdatedSuccess = false;
        $scope.kayaSavedFalue = false;
        $scope.kayaUpdateFalue = false;
        $scope.showEditAdd = false;

        $http.get("index.php/timeline").success(function(data){
            $scope.timelineactivity = data;
        });


        $scope.completeTask = function(task){
            $http.post("index.php/timeline/complete/"+task.id).success(function (updatedTask) {
                for (var i = 0; i < $scope.timelineactivity.length; i++) {
                    if ($scope.timelineactivity[i].id == updatedTask.id) {
                        $scope.timelineactivity[i] = updatedTask;
                        break;
                    }
                }
            });
        }
        $scope.incompleteTask = function(task){
            $http.post("index.php/timeline/incomplete/"+task.id).success(function (updatedTask) {
                for (var i = 0; i < $scope.timelineactivity.length; i++) {
                    if ($scope.timelineactivity[i].id == updatedTask.id) {
                        $scope.timelineactivity[i] = updatedTask;
                        break;
                    }
                }
            });
        }

        $scope.saveUser = function(user){
            $scope.currentSaving = true;
            $http.post("index.php/timeline", user).success(function (newUser) {
                newUser.status = 0;
                $scope.timelineactivity.push(newUser);
                $scope.currentKaya = {};
                $scope.kayaSavedSuccess = true;
                $scope.currentSaving = false;
                $scope.kayaSavedFalue = false;
                $mdToast.show(
                    $mdToast.simple()
                        .content('Timeline Created Successfully!')
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
            $http.post("index.php/timeline/"+user.id, user).success(function (newUser) {
                for (var i = 0; i < $scope.timelineactivity.length; i++) {
                    if ($scope.timelineactivity[i].id == newUser.id) {
                        $scope.timelineactivity[i] = newUser;
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
                $http.post("index.php/delete/timeline/"+id).success(function (newVal) {
                    $scope.deletedUser[id] = true;
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Timeline Deleted Successfully!')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                    );
                });
            }, function() {

            });
        };
    });
