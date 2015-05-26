/**
 * Created by kelvin on 1/14/15.
 */
angular.module("malariaApp")
    .controller("distributionCtrl",function($scope,$http){
        $scope.districtVisible = [];
        $scope.villageVisible = [];
        $scope.wardVisible = [];
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
            $http.get("index.php/warddetails/"+currentKaya.district).success(function(distr){
                $scope.showDisList = true;
                $scope.data.onedistrict = {};
                $http.get("index.php/wards/district/"+currentKaya.district).success(function(distr){
                    $scope.data.onedistrict.wardlist = distr;
                    $scope.data.onedistrict.villagelist = [];
                    angular.forEach($scope.data.onedistrict.wardlist,function(val){
                        var ward = val;
                        $http.get("index.php/people/ward/"+val.id).success(function(ppl){
                            ward.people = ppl;
                        });
                        $http.get("index.php/village/ward/"+ward.id).success(function(distr){
                            ward.villagelist = distr;
                            ;
                            angular.forEach(ward.villagelist,function(val){
                                var vill = val;
                                $scope.data.onedistrict.villagelist.push(val);
                                $http.get("index.php/people/village/"+val.id).success(function(ppl){
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
    });