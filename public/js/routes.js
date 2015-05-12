/**
 * Created by kelvin on 1/9/15.
 */
angular.module("malariaApp")
    .run( function($rootScope, $location) {
        $rootScope.showLoader = false;
        // register listener to watch route changes
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            $rootScope.showLoader = true;
        });
        // register listener to watch route changes successful
        $rootScope.$on( "$locationChangeSuccess", function(event, next, current) {
            $rootScope.showLoader = false;
        });
    })
    .config( function($routeProvider){
    $routeProvider.when("/registration",{
        templateUrl: 'views/registration.html',
        controller: 'kayaCtrl'
    });
    $routeProvider.when("/import",{
        templateUrl: 'views/import.html',
        controller: 'importCtrl'
    });

    $routeProvider.when("/home",{
        templateUrl: 'views/home.html',
        controller: 'malariaAppCtrl'
    });

    $routeProvider.when("/distribution",{
        templateUrl: 'views/distribution.html',
        controller: 'distributionCtrl'
    });

    $routeProvider.when("/distribution_list1",{
        templateUrl: 'views/distribution_list1.html',
        controller: 'distributionCtrl'
    });

    $routeProvider.when("/supervisor",{
        templateUrl: 'views/supervisor.html',
        controller: 'distributionCtrl'
    });

    $routeProvider.when("/distribute",{
        templateUrl: 'views/distribute.html',
        controller: 'distributeCtrl'
    });

    $routeProvider.when("/verify",{
        templateUrl: 'views/verify.html',
        controller: 'distributeCtrl'
    });

    $routeProvider.when("/stations",{
        templateUrl: 'views/stations.html',
        controller: 'stationsCtrl'
    });

    $routeProvider.when("/distribution_list",{
        templateUrl: 'views/distribution_list.html',
        controller: 'listCtrl'
    });

    $routeProvider.when("/delivery",{
        templateUrl: 'views/derlively.html',
        controller: 'deliveryCtrl'
    });
//
    $routeProvider.when("/users",{
        templateUrl: 'views/users.html',
        controller: 'userCtrl'
    });
        $routeProvider.when("/coupon_search",{
        templateUrl: 'views/coupon_search.html',
        controller: 'searchCtrl'
    });

    $routeProvider.when("/settings",{
        templateUrl: 'views/settings.html',
        controller: 'settingsCtrl'
    });

    $routeProvider.when("/statistics_distribution",{
        templateUrl: 'views/statistics_distribution.html',
        controller: 'statisticsCtrl'
    });

    $routeProvider.when("/profile",{
        templateUrl: 'views/profile.html',
        controller: 'userCtrl'
    });
    $routeProvider.when("/changePass",{
        templateUrl: 'views/changePass.html',
        controller: 'userCtrl'
    });
    $routeProvider.when("/message_recipient",{
        templateUrl: 'views/message_recipient.html',
        controller: 'messageCtrl'
    });

    $routeProvider.when("/timeline",{
        templateUrl: 'views/timeline.html',
        controller: 'timelineCtrl'
    });

    $routeProvider.when("/timeline_show",{
        templateUrl: 'views/timeline_show.html',
        controller: 'timelineCtrl'
    });


    $routeProvider.otherwise({
        redirectTo: '/home'
    });



});