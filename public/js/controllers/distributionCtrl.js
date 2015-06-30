/**
 * Created by kelvin on 1/14/15.
 */
angular.module("malariaApp")
    .controller("distributionCtrl",function($scope,$http){
        $scope.districtVisible = [];
        $scope.villageVisible = [];
        $scope.wardVisible = [];
        $scope.showloader = false;
        angular.forEach($scope.data.regions,function(value,index){
            var region = value;
////            $http.get("index.php/districts/region/"+value.id).success(function(distr){
////                region.districts = distr;
////                angular.forEach(region.districts,function(val){
////                    var district = val;
////                    $http.get("index.php/people/district/"+val.id).success(function(ppl){
////                        district.people = ppl;
////                    });
////                });
////            });
            if(!region.people){
                $http.get("index.php/people/region/"+value.id).success(function(ppl){
                    region.people = ppl;
                });
            }

        })
        $scope.showDistrictDetails = function(region){
            $scope.districtVisible=[];
            $scope.villageVisible = [];
            $scope.wardVisible = [];
                $http.get("index.php/districts/region/"+region.id).success(function(distr){
                    region.districts = distr;
                    angular.forEach(region.districts,function(val){
                        var district = val;
                        $http.get("index.php/people/district/"+val.id).success(function(ppl){
                            district.people = ppl;
                        });
                    });
                });
            $scope.districtVisible[region.id] = true;
        }

        $scope.hideDistrictDetails = function(region){
            $scope.districtVisible[region.id] = false;
        }


        $scope.showWardDetails = function(district){
            $scope.wardVisible = [];
            $scope.villageVisible = [];
                $http.get("index.php/wards/district/"+district.id).success(function(distr){
                    district.ward = distr;
                    angular.forEach(district.ward,function(val){
                        var ward = val;
                        $http.get("index.php/people/ward/"+val.id).success(function(ppl){
                            ward.people = ppl;
                        });
                    });
                });
            $scope.wardVisible[district.id] = true;
        }

        $scope.hideWardDetails = function(district){
            $scope.wardVisible[district.id] = false;
        }


        $scope.showVillageDetails = function(ward){
            $scope.villageVisible = [];
                $http.get("index.php/village/ward/"+ward.id).success(function(distr){
                    ward.village = distr;
                    angular.forEach(ward.village,function(val){
                        var vill = val;
                        $http.get("index.php/people/village/"+val.id).success(function(ppl){
                            vill.people = ppl;
                        });
                    });
                });
            $scope.villageVisible[ward.id] = true;
        }

        $scope.hideVillageDetails = function(ward){
            $scope.villageVisible[ward.id] = false;
        }
        $scope.showDisList = false;
        $scope.getList = function(currentKaya){
            $scope.showDisList = false;
            $scope.showloader = true;
            $http.get("index.php/warddetails/"+currentKaya.district).success(function(distr){
                $scope.showDisList = true;
                $scope.data.onedistrict = {};
                $http.get("index.php/wards/district/"+currentKaya.district).success(function(distr){
                    $scope.data.onedistrict.wardlist = distr;
                    $scope.data.onedistrict.villagelist = [];
                    var i = 0;
                    angular.forEach($scope.data.onedistrict.wardlist,function(val){

                        var ward = val;
                        $http.get("index.php/people/ward/"+val.id).success(function(ppl){

                            ward.people = ppl;
                        });
                        $http.get("index.php/village/ward/"+ward.id).success(function(distr){
                            ward.villagelist = distr;
                            var j = 0;
                            angular.forEach(ward.villagelist,function(val){
                                var vill = val;
                                $scope.data.onedistrict.villagelist.push(val);
                                $http.get("index.php/people/village/"+val.id).success(function(ppl){
                                    j++;
                                    if(j == ward.villagelist.length){
                                        i++;
                                        if(i == $scope.data.onedistrict.wardlist.length){
                                            $scope.showloader = false;
                                        }
                                    }
                                    vill.people = ppl;
                                });
                            });
                        });
                    });
                });
            });

        }

        $scope.closeList = false;
        $scope.data.closeWards = {};
        $scope.getDistrict = function(arra){
            $scope.closeList = false;
            $scope.villageVisible = [];
            $http.get("index.php/people/district/"+arra.district).success(function(ppl){
                $scope.data.closeWards.name = ppl.name;
            });
                $http.get("index.php/wards/district/"+arra.district).success(function(distr){
                    $scope.closeList = true;
                    $scope.data.closeWards = distr;
                    angular.forEach($scope.data.closeWards,function(val){
                        var ward = val;
                        $http.get("index.php/people/ward/"+val.id).success(function(ppl){
                            ward.people = ppl;
                        });
                    });
                });
        }

        $scope.closeDistrict = function(arra){
            alert("Net Distribution Process Closed");
            $scope.data.closeWards = {};
            $scope.currentKaya = {};
            $scope.closeList = false;
        }




    }).controller('deliveryCtrl',function($scope,$http){
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            dateFormat: 'mm-dd-yy'
        };

        $scope.saveDerliverly = function(currentKaya){
            $http.post("index.php/kaya/derlivery", currentKaya).success(function (newKaya) {
                $scope.wardDetails.derlivery_status =  newKaya.derlivery_status;
            });
        }

        $scope.getVillage = function(village){
            $http.get("index.php/village/"+village).success(function(ppl){
                console.log(ppl)
                $scope.wardDetails = ppl;
            });
        }
    }).controller('couponSumaryCtrl',function($scope,$http){
        $scope.districtData = {};
        $scope.districtData.one= 0;$scope.districtData.two= 0;$scope.districtData.three= 0;$scope.districtData.four= 0;
        $scope.districtData.five= 0;$scope.districtData.six= 0;$scope.districtData.seven= 0;$scope.districtData.eight= 0;
        $scope.districtData.nine= 0;$scope.districtData.ten= 0;$scope.districtData.eleven= 0;$scope.districtData.fiften= 0;
        $scope.districtData.fiften= 0; $scope.districtData.twenty= 0; $scope.districtData.twentyfive= 0;
        $scope.districtData.thirty= 0;$scope.districtData.thirtyfive= 0;$scope.districtData.forty = 0;
        $scope.showloader = false;
        $scope.getList = function(currentKaya){
            $scope.showDisList = false;
            $scope.showloader = true;
            $http.get("index.php/couponSummary/"+currentKaya.district).success(function(ppl){
                $scope.showDisList = true;
                $scope.showloader = false;
                angular.forEach(ppl,function(data){
                    if(data.count == '1')
                        $scope.districtData.one++;
                    if(data.count == '2')
                        $scope.districtData.two++;
                    if(data.count == '3')
                        $scope.districtData.three++;
                    if(data.count == '4')
                        $scope.districtData.four++;
                    if(data.count == '5')
                        $scope.districtData.five++;
                    if(data.count == '6')
                        $scope.districtData.six++;
                    if(data.count == '7')
                        $scope.districtData.seven++;
                    if(data.count == '8')
                        $scope.districtData.eight++;
                    if(data.count == '9')
                        $scope.districtData.nine++;
                    if(data.count == '10')
                        $scope.districtData.ten++;
                    if(data.count > 10 && data.count < 16 )
                        $scope.districtData.eleven++;
                    if(data.count > 15 && data.count < 21 )
                        $scope.districtData.fiften++;
                    if(data.count > 20 && data.count < 26 )
                        $scope.districtData.twenty++;
                    if(data.count > 25 && data.count < 31 )
                        $scope.districtData.twentyfive++;
                    if(data.count > 30 && data.count < 36 )
                        $scope.districtData.thirty++;
                    if(data.count > 35 && data.count < 41 )
                        $scope.districtData.thirtyfive++;
                    if(data.count > 40  )
                        $scope.districtData.forty++;
                });
                var serie =[];
                angular.forEach($scope.districtData,function(val){
//                    $http.post("index.php/getReportValue",{'area':$scope.data.category,'category':$scope.data.report_type,'id':$scope.getAreaID(val),'category_value':value}).success(function(data){
                        serie.push( parseInt(val));
//                    });
                });
                $scope.chartConfig.xAxis.categories = ['1','2','3','4','5','6','7','8','9','10','11-15','16-20','21-25','25-30','31-35','36-40','41-Above']
                $scope.chartConfig.series = [{type: 'column', name: 'Coupon Summary', data: serie}]
            });
        }


        $scope.getChart = function(currentKaya){

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
    });