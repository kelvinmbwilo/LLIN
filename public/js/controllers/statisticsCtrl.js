/**
 * Created by kelvin on 3/2/15.
 */
angular.module('malariaApp').controller('statisticsCtrl',function($scope,$http){
    //getting all regions
    $scope.data = {};
    $scope.data.usedRegions = [];
    $scope.data.usedDistricts = [];
    $scope.data.usedWards = [];
    $scope.data.usedVillages = [];
    $scope.table = {};

    //getting districts
    $http.get("index.php/districts").success(function(data){
        $scope.data.districts = data;
        $scope.data.usedDistricts = [];
        angular.forEach(data,function(datta){
            $scope.data.usedDistricts.push({name: datta.district, ticked: false });
        });
    });

    //getting Regions
    $http.get("index.php/regions").success(function(data){
        $scope.data.regions = data;
        $scope.data.usedRegions = [];
        angular.forEach(data,function(value){
            $scope.data.usedRegions.push({name: value.region, ticked: false})
        });
    });

    //preparing the wards
    $scope.getWards1 = function(id){

        $http.get("index.php/wards/district/"+id).success(function(distr){
            $scope.data.usedWards = [];
            angular.forEach(distr,function(value){
                $scope.data.usedWards.push({name: value.name, ticked: false})
            });
        });
    }
    //preparing the wards
    $scope.getWards = function(id){

        $http.get("index.php/wards/district/"+id).success(function(distr){
            $scope.data.disward = distr;
        });
    }

    //preparing the village
    $scope.getVillages1 = function(id){

        $http.get("index.php/village/ward/"+id).success(function(distr){
            $scope.data.usedVillages = [];
            angular.forEach(distr,function(value){
                $scope.data.usedVillages.push({name: value.name, ticked: false})
            });
        });
    }

    $scope.prepareType = function(type){
        if(type == "Administrative Units" || type == "Delivery Summary"){
            $scope.data.category = "Regions";
        }
    }

    $scope.prepareDropdown = function(){
        $scope.area = [];
        if($scope.data.category == "Regions"){
            angular.forEach($scope.data.selectedRegions,function(value){
                $scope.area.push(value.name);
            });
        }if($scope.data.category == "Districts"){
            angular.forEach($scope.data.selectedDistricts,function(value){
                $scope.area.push(value.name);
            });
        }if($scope.data.category == "Wards"){

            angular.forEach($scope.data.selectedWards,function(value){
                $scope.area.push(value.name);
            });
        }if($scope.data.category == "Village"){
            angular.forEach($scope.data.selectedVillages,function(value){
                $scope.area.push(value.name);
            });
        }
        $scope.chartConfig.xAxis.categories =$scope.area;
    }

    $scope.changeCats = function(){
        if($scope.data.report_type == "Coupon Summary"){
            $scope.subCategory = ["Redeemed Coupons","Non Redeemed Coupons"]
        }if($scope.data.report_type == "Distribution Summary"){
            $scope.subCategory = ["Coupons","Nets"]
        }if($scope.data.report_type == "Population"){
          $scope.subCategory = ["Male","Female"]
        }if($scope.data.report_type == "Coupon Quality"){
            $scope.subCategory = ["Imported","Verified"]
        }if($scope.data.report_type == "Administrative Units"){

        }if($scope.data.report_type == "Delivery Summary"){
            $scope.subCategory = ["Delivered Nets"]
        }

    }

    $scope.prepareSeries = function(){

    }

    $scope.getData = function(){
        $scope.chartConfig.series = [{
            name: 'Motor Vehicle',
            data: []
        }];
        $scope.table.headers = [];
        $scope.table.colums = [];
        angular.forEach($scope.chartConfig.xAxis.categories,function(value){
            $scope.table.headers.push({name:value});
//                $scope.chartConfig.series[0].data.push(Math.floor(Math.random() * 30))
            $http.get('../../vehicle/'+$scope.column+'/'+value).success(function(data){
                $scope.table.colums.push({val:data});
                $scope.chartConfig.series[0].data.push(parseInt(data));
            });
        })
    }

    //changing chart types
    $scope.data.chartType = 'column'
    $scope.changeChart = function(type){
        $scope.displayTable = false;
        if(type == "spider"){
            $scope.chartConfig.options.chart.type = 'line';
            $scope.chartConfig.options.chart.polar = true;
        }else if(type == 'combined'){
            $scope.chartConfig.options.chart.polar =false;
        }else if(type == 'table'){
            $scope.chartConfig.options.chart.polar = false;
            $scope.displayTable = true;
        }else{
            $scope.chartConfig.options.chart.type = type;
            $scope.chartConfig.options.chart.polar = false;
        }

    };

    //drawing some charts
    $scope.chartConfig = {
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        labels: {
            items: [{
                html: 'Total fruit consumption',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Jane',
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'John',
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'column',
            name: 'Joe',
            data: [4, 3, 3, 9, 0]
        }, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }, {
            type: 'pie',
            name: 'Total consumption',
            data: [{
                name: 'Jane',
                y: 13,
                color: Highcharts.getOptions().colors[0] // Jane's color
            }, {
                name: 'John',
                y: 23,
                color: Highcharts.getOptions().colors[1] // John's color
            }, {
                name: 'Joe',
                y: 19,
                color: Highcharts.getOptions().colors[2] // Joe's color
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    };

//    $scope.changeCats();

})
