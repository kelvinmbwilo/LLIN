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
    $scope.data.report_type = "Coupon Summary";
    $scope.data.category = "Regions"
    $scope.table = {};

    //getting districts
    $http.get("index.php/districts").success(function(data){
        $scope.data.districts = data;
        $scope.data.usedDistricts = [];
        angular.forEach(data,function(datta){
            $scope.data.usedDistricts.push({name: datta.district,id:datta.id, ticked: false });
        });
    });

    //getting Regions
    $http.get("index.php/regions").success(function(data){
        $scope.data.regions = data;
        $scope.data.usedRegions = [];
        angular.forEach(data,function(value){
            $scope.data.usedRegions.push({name: value.region,id:value.id, ticked: false})
        });
    });

    //preparing the wards
    $scope.getWards1 = function(id){

        $http.get("index.php/wards/district/"+id).success(function(distr){
            $scope.data.usedWards = [];
            angular.forEach(distr,function(value){
                $scope.data.usedWards.push({name: value.name,id:value.id, ticked: false})
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
                $scope.data.usedVillages.push({name: value.name,id:value.id, ticked: false})
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
        $scope.area1 = [];
        if($scope.data.category == "Regions"){
            angular.forEach($scope.data.selectedRegions,function(value){
                $scope.area.push(value.name);
                $scope.area1.push({name:value.name,id:value.id});
            });
        }if($scope.data.category == "Districts"){
            angular.forEach($scope.data.selectedDistricts,function(value){
                $scope.area.push(value.name);
                $scope.area1.push({name:value.name,id:value.id});
            });
        }if($scope.data.category == "Wards"){
            angular.forEach($scope.data.selectedWards,function(value){
                $scope.area.push(value.name);
                $scope.area1.push({name:value.name,id:value.id});
            });
        }if($scope.data.category == "Village"){
            angular.forEach($scope.data.selectedVillages,function(value){
                $scope.area.push(value.name);
                $scope.area1.push({name:value.name,id:value.id});
            });
        }
        $scope.chartConfig.xAxis.categories =$scope.area;
        $scope.prepareSeries();
    }

    $scope.changeCats = function(){
        if($scope.data.report_type == "Coupon Summary"){
            $scope.subCategory = ["All Coupons","Redeemed Coupons","Non Redeemed Coupons"]
        }if($scope.data.report_type == "Distribution Summary"){
            $scope.subCategory = ["Coupons","Nets"]
        }if($scope.data.report_type == "Population"){
          $scope.subCategory = ["Male","Female"]
        }if($scope.data.report_type == "Coupon Quality"){
            $scope.subCategory = ["Imported","Verified"]
        }if($scope.data.report_type == "Administrative Units"){
            $scope.subCategory =[];
            if($scope.data.category == "Regions"){
                angular.forEach($scope.data.usedDistricts,function(value){
                    $scope.area.push(value.name);
                    $scope.area1.push({name:value.name,id:value.id});
                });
            }if($scope.data.category == "Districts"){
                angular.forEach($scope.data.selectedWards,function(value){
                    $scope.area.push(value.name);
                    $scope.area1.push({name:value.name,id:value.id});
                });
            }if($scope.data.category == "Wards"){
                angular.forEach($scope.data.selectedWards,function(value){
                    $scope.area.push(value.name);
                    $scope.area1.push({name:value.name,id:value.id});
                });
            }
        }if($scope.data.report_type == "Delivery Summary"){
            $scope.subCategory = ["Delivered Nets","Required Nets"]
        }

    }

    //changing chart types
    $scope.data.chartType = 'column'
    $scope.changeChart = function(type){
        $scope.displayTable = false;
       if(type === 'table'){
            $scope.displayTable = true;
           $scope.data.chartType = 'table';
        }else if(type === 'excel'){
            $scope.displayTable = true;
           $scope.data.chartType = 'excel';
        }else{
            $scope.data.chartType = type;
        }
        $scope.prepareSeries();
    };

    $scope.prepareSeries = function(){

        $scope.changeCats();
        $scope.normalseries = [];
           if($scope.data.chartType === "pie"){
               delete $scope.chartConfig.chart;
               var serie = [];
               angular.forEach($scope.subCategory,function(value){
                angular.forEach($scope.chartConfig.xAxis.categories,function(val){
                    $http.post("getReportValue",{'area':$scope.data.category,'category':$scope.data.report_type,'id':''}).success(function(){

                    });
                   serie.push({name: value+" - "+ val , y: Math.random()*100 })
                });
            });
            $scope.normalseries.push({type: $scope.data.chartType, name: $scope.data.category, data: serie})
            $scope.chartConfig.series = $scope.normalseries;
           }else if($scope.data.chartType === "excel"){
               $scope.table.headers = [];
               $scope.table.colums =[];
               angular.forEach($scope.subCategory,function(value){
                   var serie = [];
                   $scope.table.headers.push(value);
               });
               angular.forEach($scope.chartConfig.xAxis.categories,function(val){
                   var seri = [];
                   angular.forEach($scope.subCategory,function(value){
                       seri.push({name:value,value:parseInt(Math.random()*100)});
                   });

                   $scope.table.colums.push({name:val,values:seri});

               });
               window.location.assign("index.php/excel?data="+JSON.stringify($scope.table));
               alert("drawing excel");

           }else if($scope.data.chartType === "nyingine"){
               delete $scope.chartConfig.chart;
               var serie1 = [];
               angular.forEach($scope.subCategory,function(value){
                   var serie = [];

                   angular.forEach($scope.chartConfig.xAxis.categories,function(val){
                       serie.push(Math.random()*100)
                       serie1.push({name: value+" - "+ val , y: Math.random()*100 })
                   });
                   $scope.normalseries.push({type: 'column', name: value, data: serie});
                   $scope.normalseries.push({type: 'spline', name: value, data: serie});
               });
               $scope.normalseries.push({type: 'pie', name: $scope.data.category, data: serie1,center: [100, 80],size: 150,showInLegend: false,
                   dataLabels: {
                       enabled: false
                   }})
               $scope.chartConfig.series = $scope.normalseries;
           }else if($scope.data.chartType === 'table'){
               $scope.table.headers = [];
               $scope.table.colums =[];
               angular.forEach($scope.subCategory,function(value){
                   var serie = [];
                   $scope.table.headers.push(value);
               });
               angular.forEach($scope.chartConfig.xAxis.categories,function(val){
                   var seri = [];
                   angular.forEach($scope.subCategory,function(value){
                       seri.push({name:value,value:parseInt(Math.random()*100)});
                   });

                   $scope.table.colums.push({name:val,values:seri});
               });
           }else{
               delete $scope.chartConfig.chart;
               angular.forEach($scope.subCategory,function(value){
                   var serie = [];
                   angular.forEach($scope.area1,function(val){
                       serie.push(Math.random()*100)
                       $scope.getData(value,val.id);
                   });
                   $scope.normalseries.push({type: $scope.data.chartType, name: value, data: serie})
               });
               $scope.chartConfig.series = $scope.normalseries;
           }

    }

    $scope.getData = function(value,val){
        $http.post("index.php/getReportValue",{category:$scope.report_type, area:$scope.data.category, categoryValue:value,areaValue:val}).success(function(data){
            return data;
        })
    }


    //drawing some charts
    $scope.chartConfig = {
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: []
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
        series: []
    };
//    $scope.changeCats();

})
