<!DOCTYPE html>
<html lang="en" ng-app="malariaApp">
<head>
    <title>LLIN MRC DATABASE</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="icon" type="image/ico" href="http://aqvatarius.com/themes/taurus_v12/html/favicon.ico"/>

    <link href="<?php echo asset("css/stylesheets.css") ?>" rel="stylesheet" type="text/css" />

    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery-ui.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery-migrate.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/globalize.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/bootstrap/bootstrap.min.js") ?>'></script>

<!--    <script type='text/javascript' src='--><?php //echo asset("js/plugins/mcustomscrollbar/jquery.mCustomScrollbar.min.js") ?><!--'></script>-->
    <script type='text/javascript' src='<?php echo asset("js/plugins/uniform/jquery.uniform.min.js") ?>'></script>
    <script src="<?php echo asset('DataTables/media/js/jquery.dataTables.js') ?>"></script>

    <script type='text/javascript' src='<?php echo asset("js/plugins.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/actions.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/settings.js") ?>'></script>

    <script src="<?php echo asset('js/angular.js') ?>"></script>
    <script src="<?php echo asset('js/angular-route.js') ?>"></script>
    <script src="<?php echo asset('js/angular-resource.js') ?>"></script>
    <script src="<?php echo asset('js/angular-animate.js') ?>"></script>
    <script src="<?php echo asset('angular-ui-date/src/date.js') ?>"></script>
    <script src="<?php echo asset('bower_components/angular-aria/angular-aria.min.js') ?>"></script>
    <script src="<?php echo asset('bower_components/hammerjs/hammer.min.js') ?>"></script>
    <script src="<?php echo asset('bower_components/angular-material/angular-material.min.js') ?>"></script>
    <script src="<?php echo asset('js/angular-file-upload.min.js')?>"></script>


    <script src="<?php echo asset('js/abn_tree_directive.js') ?>"></script>
    <script src="<?php echo asset('angular-datatables/dist/angular-datatables.js') ?>"></script>
    <script src="<?php echo asset('highcharts-ng/src/highcharts-custom.js') ?>"></script>
    <script src="<?php echo asset('highcharts-ng/src/highcharts-ng.js') ?>"></script>
    <link href="<?php echo asset('css/abn_tree.css') ?>" rel="stylesheet" />
    <link href="<?php echo asset('font-awesome/css/font-awesome.css') ?>" rel="stylesheet" />
    <link rel="stylesheet" href="<?php echo asset('bower_components/angular-material/angular-material.css') ?>">
    <script>
        angular.module("malariaApp",['ngRoute','ngResource','ngAnimate','ngMaterial','angularBootstrapNavTree','ui.date',"datatables","highcharts-ng","angularFileUpload"]);
    </script>
    <script src="<?php echo asset('js/routes.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/malariaAppCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/kayaCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/distributionCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/distributeCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/stationsCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/listCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/userCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/importCtrl.js') ?>"></script>
    <script src="<?php echo asset('js/controllers/searchCtrl.js') ?>"></script>
    <style>
        @font-face {
            font-family: myBoldFont;
            src: url(<?php echo asset('Oswald/OpenSans-Bold.ttf') ?>);
        }@font-face {
            font-family: myLightFont;
            src: url(<?php echo asset('Oswald/OpenSans-Regular.ttf') ?>);
        }@font-face {
            font-family: myRegularFont;
            src: url(<?php echo asset('Oswald/Oswald-Regular.ttf') ?>);
        }
        body{
            font-family: myLightFont ;
        }
        .dropdown:hover .dropdown-menu {
            display: block;
        }
    </style>
</head>
<body class="bg-img-num20" data-settings="open" ng-controller="malariaAppCtrl" style="min-height: 820px">
<div class="container theme-black container-fixed">
<div class="row">
    <div class="col-md-12">
        <header style="padding-left: 8px;padding-right: 10px;padding-bottom: 0px; padding-top: 5px">
            <div class="row">
                <div class="col-md-2 hidden-sm">
                    <img alt="Brand" src="<?php echo asset('img/Nembo.png') ?>" style="height: 70px;width: 70px" class="img-rounded pull-left">
                </div>
                <div class="col-sm-12 col-md-8">
                    <h4 class="text-center" style="letter-spacing: 1px;font-family: myBoldFont "> WIZARA YA AFYA NA USTAWI WA JAMII</h4>
                    <h4 class="text-center" style="letter-spacing: 1px;font-family: myBoldFont"> MPANGO WA TAIFA WA KUDHIBITI MALARIA - LLIN MRC DATABASE</h4>
                </div>
                <div class="col-md-2 hidden-sm">
                    <img alt="Brand" src="<?php echo asset('img/malaria.png') ?>" style="height: 70px;width: 70px" class="img-rounded pull-right">
                </div>
            </div>
        </header>

        <nav class="navbar brb" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-reorder"></span>
                </button>
                <a class="navbar-brand" href="index.html" style="padding: 0px;"><img src="<?php echo asset('img/malaria_haikubaliki.png') ?>" style="height: 40px;width: 40px" class="img-rounded"></a>
            </div>
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav">
                    <li ng-class="{ active: isActive('/home') }">
                        <a href="#/home">
                            <span class="icon-home"></span> dashboard
                        </a>
                    </li>
                    <li class="dropdown" ng-class="{ active: isActive('/registration') || isActive('/import') || isActive('/distribute') || isActive('/verify') }">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> Registration <span class="icon-edit"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/registration"><i class="fa fa-plus"></i> Add Coupons</a></li>
                            <li><a href="#/import"><i class="fa fa-upload"></i> Import Coupons</a></li>
                            <li><a href="#/distribute"><i class="fa fa-check"></i> Redeem Coupons</a></li>
                            <li><a href="#/verify"><i class="fa fa-search"></i> Verify Coupons</a></li>
                        </ul>
                    </li>
                    <li class="dropdown" ng-class="{ active: isActive('/distribution_list') || isActive('/distribution_list1') || isActive('/distribution') }">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> Reports <span class="icon-list"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/distribution"><i class="fa fa-book"></i> Summary </a></li>
                            <li><a href="#/distribution_list1"><i class="fa fa-list"></i> Distribution List </a></li>
                            <li><a href="#/distribution_list"><i class="fa fa-th"></i> Issuing List </a></li>
                        </ul>
                    </li>
                    <li class="dropdown" ng-class="{ active: isActive('/supervisor') || isActive('/delivery') }">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> Supervisor <span class="icon-briefcase"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/supervisor"><i class="fa fa-list"></i> Activity Closing </a></li>
                            <li><a href="#/delivery"><i class="fa fa-th"></i> Net Delivery </a></li>
                            <li><a href="#/delivery"><i class="fa fa-th"></i> Time Line </a></li>
                            <li><a href="#/coupon_search"><i class="fa fa-th"></i> Coupon Search </a></li>
                        </ul>
                    </li>
                    <li class="dropdown" ng-class="{ active: isActive('/distribution_list') || isActive('/distribution_list1') || isActive('/distribution') }">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> Statistic <span class="icon-bar-chart"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/distribution"><i class="fa fa-book"></i> Distribution </a></li>
                            <li><a href="#/distribution_list1"><i class="fa fa-list"></i> Delivery </a></li>
                            <li><a href="#/distribution_list1"><i class="fa fa-list"></i> Households </a></li>
                            <li><a href="#/distribution_list"><i class="fa fa-th"></i> Coupons  Quality </a></li>
                        </ul>
                    </li>
                    <li class="dropdown" ng-class="{ active: isActive('/stations') || isActive('/users') }">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> Settings <span class="icon-cog"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/stations">Administrative Units</a></li>
                            <li><a href="#/users"> Users </a></li>
                            <li><a href="#/add_timeline"> Add Time Line </a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> User <span class="icon-user"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#/profile"><i class="fa fa-envelope"></i> Messages</a></li>
                            <li><a href="#/profile"><i class="fa fa-user"></i> profile</a></li>
                            <li><a href="#/change_password"><i class="fa fa-lock"></i> change password</a></li>
                            <li class="divider"></li>
                            <li><a href="index.php/login"><i class="fa fa-power-off"></i> logout</a></li>
                        </ul>
                    </li>
                </ul>
                <form class="navbar-form navbar-right" role="search">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="search..."/>
                    </div>
                </form>
            </div>
        </nav>

    </div>
</div>
    <section style="min-height: 600px">
        <div ng-view></div>
    </section>
<div class="row">
    <div class="page-footer">
        <div class="page-footer-wrap">
            <div class="side text-center">
                Copyirght &COPY; LLIN MRC DATABASE <?php echo date('Y') ?>. All rights reserved.
            </div>
        </div>
    </div>
</div>
</div>

</body>
</html>