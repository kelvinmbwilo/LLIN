/**
 * Created by kelvin on 1/19/15.
 */
angular.module("malariaApp")
    .controller('stationsCtrl',function($scope,$http,$mdDialog){
        var  tree;
        $scope.showLoading = false;
        $scope.getRegionChildren = function(id){
            var child = [];
            var regionId = id;
            angular.forEach($scope.data.districts,function(value){
               if(value.region_id == regionId){
                   var label = value.district;
                   var children = ['loading...'];
                   var id = value.id;
                   var level = 3;
                   child.push({label:label,children:children,id:id,level:level,onSelect: function(branch){
                       //getting all wards for this district
                       $scope.listItems  = $scope.listWards(branch.id);
                       var branch =branch;
                       $http.get("index.php/wards/district/"+branch.id).success(function(data){
                           branch.children = [];
                           angular.forEach(data,function(value){
                               var label = value.name;
                               var children = ['loading...'];
                               var id = value.id;
                               var level = 4;
                               branch.children.push({label:label,children:children,id:id,level:level,noLeaf: true,onSelect: function(branch){
                                   //getting all villages for this ward
                                   $scope.listItems  = $scope.listVillage(branch.id);
                                   var branch =branch;
                                   $http.get("index.php/village/ward/"+branch.id).success(function(data){
                                       branch.children = [];
                                       angular.forEach(data,function(value){
                                           var label = value.name;
                                           var children = [];
                                           var id = value.id;
                                           var level = 5;
                                           branch.children.push({label:label,children:children,id:id,level:level,noLeaf: false,onSelect: function(branch){
                                              $scope.listItems  = $scope.distributionList(branch.id);
                                           }
                                           });
                                       })
                                   });

                               }});
                           })
                       });

                   }});
               }

            });
            return child;
        }
        var child = [];
        angular.forEach($scope.data.regions,function(value){
            var label = value.region;
            var children = $scope.getRegionChildren(value.id);
            var id = value.id;
            var level = 2;
            child.push({label:label,children:children,id:id,level:level});
        });
        $scope.testObject = child;
        $scope.data.orgUnit = [{
            label: 'Tanzania',
            children: child,
            id: 3
        }];
        $scope.my_tree = tree = {};
        $scope.my_tree_handler = function(branch) {
            $scope.data.currentOrgUnit = branch.label;
            $scope.data.currentLevel = branch.level;
//            tree.collapse_all();
//            tree.expand_branch(branch);
            switch(branch.level){
                case 1:
                    $scope.listRegions(branch.id);
                    break;
                case 2:
                    $scope.listDistrict(branch.id);
                    break;

            }
        }

        $scope.currentListing = "";
        //list ya mikoa
        $scope.listRegions =function(){
            $scope.currentListing = "views/region_list.html";
            angular.forEach($scope.data.regions,function(value){
                var region = value;
                $http.get("index.php/regiondetails/"+value.id).success(function(data){
                    region.details = data;
                });
            });

        }
        //list ya wilaya
        $scope.listDistrict =function(id){
            $scope.currentListing = "views/district_list.html";
            $http.get("index.php/districtdetails/"+id).success(function(data){
                $scope.data.distictss =  data;
            });
        }
        //list ya kata
        $scope.listWards =function(id){
            $scope.currentListing = "views/ward_list.html";
            $http.get("index.php/warddetails/"+id).success(function(data){
                $scope.data.wardss =  data;
            });
        }
        //list ya vijiji
        $scope.listVillage =function(id){
            $scope.currentListing = "views/village_list.html";
            $http.get("index.php/villagedetails/"+id).success(function(data){
                $scope.data.villagess =  data;
            });
        }

        //list ya vijiji
        $scope.distributionList =function(id){
            $scope.currentListing = "views/villagedist.html";
            return "distribution List ya Villages "+id
        }

        //adding  new orgunit

        $scope.addOrgUnit = function(val) {
            $scope.data.addedOrgUnit = null;
            $scope.addingOrg = true;
            var b;
            b = tree.get_selected_branch();
            switch (b.level){
                case 1:
                    $http.post("index.php/region", {val:val}).success(function (newKaya) {
                        $scope.addingOrg = false;
                        $scope.data.regions.push({
                            region: newKaya.region,
                            id:newKaya.id
                        })
                        return tree.add_branch(b, {
                            label: newKaya.region,
                            level: b.level+1,
                            id :newKaya.id,
                            children:$scope.getRegionChildren(newKaya.id)
                        });

                    })
                    break;
                case 2:
                    $http.post("index.php/adddistrict/"+b.id, {val:val}).success(function (newKaya) {
                        $scope.addingOrg = false;
                        $scope.data.distictss.push({
                            district: newKaya.district,
                            id:newKaya.id
                        })
                        return tree.add_branch(b, {
                            label: newKaya.district,
                            level: b.level+1,
                            id:newKaya.id,
                            children:[]
                        });

                    })
                    break;
                case 3:
                    $http.post("index.php/addward/"+b.id, {val:val}).success(function (newKaya) {
                        $scope.addingOrg = false;
                        $scope.data.wardss.push({
                            ward: newKaya.name,
                            id:newKaya.id
                        })
                        return tree.add_branch(b, {
                            label: newKaya.name,
                            level: b.level+1,
                            id:newKaya.id,
                            children:[]
                        });
                    })
                    break;
                case 4:
                    $http.post("index.php/addvillage/"+ b.id, {val:val}).success(function (newKaya) {
                        $scope.addingOrg = false;
                        $scope.data.villagess.push({
                            village: newKaya.name,
                            id:newKaya.id
                        })
                        return tree.add_branch(b, {
                            label: newKaya.name,
                            level: b.level+1,
                            id:newKaya.id,
                            children:[]
                        });
                    })
                    break;
                default:
                    $scope.addingOrg = false;
                    alert("this is the smallest level");
            }

        };

        $scope.currentEditRegion = [];
        $scope.currentSavingRegion = [];
        $scope.currentEditDistrict = [];
        $scope.currentSavingDistrict = [];
        $scope.currentEditWard = [];
        $scope.currentSavingWard = [];
        $scope.currentEditVillage = [];
        $scope.currentSavingVillage = [];
        $scope.showEdit = function(curVal,id,type) {
            if(type == 'region'){
                $scope.currentEditRegion = [];
                $scope.currentEditRegion[id] = true;
                $scope.data.editingregion = curVal;
            }if(type == 'district'){
                $scope.currentEditDistrict = [];
                $scope.currentEditDistrict[id] = true;
                $scope.data.editingDistrict = curVal;
            }if(type == 'ward'){
                $scope.currentEditWard = [];
                $scope.currentEditWard[id] = true;
                $scope.data.editingWard = curVal;
            }if(type == 'village'){
                $scope.currentEditVillage = [];
                $scope.currentEditVillage[id] = true;
                $scope.data.editingVillage = curVal;
            }

        };

//        edditing org units
        $scope.editOrgUnit = function(id,type,val){
            if(type == 'region'){
                $scope.currentEditRegion = [];
                $scope.currentSavingRegion[id] = true;
                $http.post("index.php/edit/"+type+"/"+id, {val:val}).success(function (newVal) {
                    for (var i = 0; i < $scope.data.regions.length; i++) {
                        if ($scope.data.regions[i].id == newVal.id) {
                            $scope.data.regions[i] = newVal;
                            break;
                        }
                    }
                    $scope.currentEditRegion = [];
                    $scope.currentSavingRegion = [];
                });
            }if(type == 'district'){
                $scope.currentEditDistrict = [];
                $scope.currentSavingDistrict[id] = true;
                $http.post("index.php/edit/"+type+"/"+id, {val:val}).success(function (newVal) {
                    for (var i = 0; i < $scope.data.distictss.length; i++) {
                        if ($scope.data.distictss[i].id == newVal.id) {
                            $scope.data.distictss[i].district = newVal.district;
                            break;
                        }
                    }
                    $scope.currentEditDistrict = [];
                    $scope.currentSavingDistrict = [];
                });
            }if(type == 'ward'){
                $scope.currentEditWard = [];
                $scope.currentSavingWard[id] = true;
                $http.post("index.php/edit/"+type+"/"+id, {val:val}).success(function (newVal) {
                    for (var i = 0; i < $scope.data.wardss.length; i++) {
                        if ($scope.data.wardss[i].id == newVal.id) {
                            $scope.data.wardss[i].ward = newVal.name;
                            break;
                        }
                    }
                    $scope.currentEditWard = [];
                    $scope.currentSavingWard = [];
                });

            }if(type == 'village'){
                $scope.currentEditVillage = [];
                $scope.currentSavingVillage[id] = true;
                $http.post("index.php/edit/"+type+"/"+id, {val:val}).success(function (newVal) {
                    for (var i = 0; i < $scope.data.villagess.length; i++) {
                        if ($scope.data.villagess[i].id == newVal.id) {
                            $scope.data.villagess[i].village = newVal.name;
                            break;
                        }
                    }
                    $scope.currentEditVillage = [];
                    $scope.currentSavingVillage = [];
                });
            }
        }

        //        deleting org units
        $scope.deletedRegion = [];
        $scope.deletedDistrict = [];
        $scope.deletedWard = [];
        $scope.deletedVillage = [];
        $scope.deleteOrgUnit = function(id,type){
            if(type == 'region'){
                $http.post("index.php/delete/"+type+"/"+id).success(function (newVal) {
                    $scope.deletedRegion[id] = true;
                });
            }if(type == 'district'){
                $http.post("index.php/delete/"+type+"/"+id).success(function (newVal) {
                    $scope.deletedDistrict[id] = true;
                });
            }if(type == 'ward'){
                $http.post("index.php/delete/"+type+"/"+id).success(function (newVal) {
                    $scope.deletedWard[id] = true;
                });
            }if(type == 'village'){
                $http.post("index.php/delete/"+type+"/"+id).success(function (newVal) {
                    $scope.deletedVillage[id] = true;
                });
            }
        }
        $scope.deletedOrgunit = [];

        $scope.showConfirm = function(ev,id,type) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this ' + type)
                .content('All child of the administrative unit will also be deleted and this action is irreversible')
                .ariaLabel('Lucky day')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                  $scope.deleteOrgUnit(id,type);
            }, function() {

            });
        };

    });

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}