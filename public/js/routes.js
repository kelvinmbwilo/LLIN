/**
 * Created by kelvin on 1/9/15.
 */
angular.module("malariaApp")
//    .run( function($rootScope, $location) {
//
//        // register listener to watch route changes
//        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//            if (!$rootScope.loggedUser) {
//                // no logged user, we should be going to #login
//                if ( next.templateUrl == "partials/login.html" ) {
//                    // already going to #login, no redirect needed
//                } else {
//                    // not going to #login, we should redirect now
//                    $location.path( "/login" );
//                }
//            }
//        });
//    })
    .config( function($routeProvider){
    $routeProvider.when("/registration",{
        templateUrl: 'views/registration.html',
        controller: 'kayaCtrl'
    });
    $routeProvider.when("/import",{
        templateUrl: 'views/import.html',
        controller: 'kayaCtrl'
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
        controller: 'settingsCtrl'
    });
//
//    $routeProvider.when("/group_settings",{
//        templateUrl: 'views/group_settings.html',
//        controller: 'settingsCtrl'
//    });
//
//    $routeProvider.when("/meetings",{
//        templateUrl: 'views/meetings.html',
//        controller: 'settingsCtrl'
//    });
//    $routeProvider.when("/addMember",{
//        templateUrl: 'views/addMember.html',
//        controller: 'settingsCtrl'
//    });


    $routeProvider.otherwise({
        redirectTo: '/home'
    });



});