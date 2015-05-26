/**
 * Created by kelvin on 1/13/15.
 */
angular.module("malariaApp")
    .controller("malariaAppCtrl",function($rootScope,$scope,$http,$location,$timeout){
        var currentYear = moment().year();
        var currentMonth = moment().month();
        $rootScope.$on("$routeChangeStart",
            function (event, current, previous, rejection) {
                $rootScope.showLoader = true;
            });
        $rootScope.$on("$routeChangeSuccess",
            function (event, current, previous, rejection) {
                    $rootScope.showLoader = false;

            });
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

        $scope.events = [
            {
                title: 'Event 1',
                type: 'warning',
                starts_at: new Date(currentYear,currentMonth,25,8,30),
                ends_at: new Date(currentYear,currentMonth,25,9,30)
            },
            {
                title: 'Event 2',
                type: 'info',
                starts_at: new Date(currentYear,currentMonth,19,7,30),
                ends_at: new Date(currentYear,currentMonth,25,9,30)
            },
            {
                title: 'This is a really long event title',
                type: 'important',
                starts_at: new Date(currentYear,currentMonth,25,6,30),
                ends_at: new Date(currentYear,currentMonth,25,6,60)
            }
        ];

        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();

        $scope.loggedUser = false;
        $scope.login = function(user){
            if(user.name == "admin" && user.pass == 'admin'){
                $scope.loggedUser = true;
            }
        }

        $scope.logout = function(){
            $scope.activenow = false;
        }

        $scope.data ={};
        //getting all kayas
        /**
         * TODO : Refine this statement to fetch by chunks

        $http.get("index.php/kaya").success(function(res){
            $scope.data.kaya = res;
        });
         */
        //getting all regions
        $http.get("index.php/regions").success(function(data){
            $scope.data.regions = data;
        });

        //getting all districts
        $http.get("index.php/districts").success(function(data){
            $scope.data.districts = data;
        });

        //getting loggedin user details
        $http.get("index.php/loggenInuser").success(function(data){
            $scope.loggedInUser = data;
        });

        //setting active link on top menu
        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };

        $scope.addTwo = function(one,two){
            return parseInt(one) + parseInt(two);
        }

        $scope.matchName = function(query) {
            return function(friend) { return friend.region_id == query; }
        };

        $scope.changeRegion = function(){
            $scope.data.disward ={};
            $scope.data.disvillage = {};
        }

        $scope.loadingWards = false;
        $scope.getWards = function(id){
            $scope.loadingWards = true;
            $scope.data.disward ={};
            $scope.data.disvillage = {};
            $http.get("index.php/wards/district/"+id).success(function(distr){
                $scope.data.disward = distr;
                $scope.loadingWards = false;

            });
        }
        $scope.loadingVillages = false;
        $scope.getVillages = function(id){
            $scope.data.disvillage = {};
            $scope.loadingVillages = true;
            $http.get("index.php/village/ward/"+id).success(function(distr){
                $scope.data.disvillage = distr;
                $scope.loadingVillages = false;
            });
        }

        $scope.findSum = function(kata){
            return Math.floor(kata.male) + Math.floor(kata.female);
        }
        $scope.findDiff = function(answer){
           if(answer/2 > 5){
               return 5
           }else{
               return answer/2
           }
        }

        $scope.getDetails =function(region){
            if(region.districts == null){
                $http.get("index.php/districts/region/"+region.id).success(function(distr){
                    region.districts = distr;
                    angular.forEach(region.districts,function(val){
                        var district = val;
                        $http.get("index.php/people/district/"+val.id).success(function(ppl){
                            district.people = ppl;
                        });
                    });
                });
            }
        }

    });
