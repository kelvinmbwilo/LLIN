<?php

class kayaController extends \BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $region = Region::find(Input::get('region'));
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table($table)->where('district',$disid)->get();
        if(Input::get('kituo') == ""){
            return DB::table(strtolower($table))->where('village',Input::get('village'))->select('uid','male', 'female','nets','station','name_of_veo')->get();
         }else{
            return DB::table(strtolower($table))->where('village',Input::get('village'))->where('station',Input::get('kituo'))->select('uid','male', 'female','nets','station','name_of_veo')->get();
        }
    }

    /**
     * Display a search result.
     *
     * @return Response
     */
    public function searchResult()
    {
        $region = Region::find(Input::get('region'));
        $table = strtolower(str_replace(" ","_",$region->region));
        //return DB::table(strtolower($table))->where('region',$regid)->get();
        if(Input::get('ward') == NULL){
            return DB::table(strtolower($table))->where('region',Input::get('region'))->where('district',Input::get('district'))->get();

        }elseif(Input::get('village') == NULL){
            return DB::table(strtolower($table))->where('region',Input::get('region'))->where('district',Input::get('district'))->where('ward',Input::get('ward'))->get();

        }else{
            return DB::table(strtolower($table))->where('region',Input::get('region'))->where('district',Input::get('district'))->where('ward',Input::get('ward'))->where('village',Input::get('village'))->get();
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function upload()
    {
        if(Input::hasFile('file'))
        {
            $region = Region::find(Input::get('region'));
            $GLOBALS['table'] = strtolower(str_replace(" ","_",$region->region));
            $file = Input::file('file'); // your file upload input field in the form should be named 'file'
            $destinationPath = public_path().'/uploads';
            $filename = $file->getClientOriginalName();
            //$extension =$file->getClientOriginalExtension(); //if you need extension of the file
            $uploadSuccess = Input::file('file')->move($destinationPath, $filename);
            chmod($destinationPath ."/".$filename , 0777);
            if($uploadSuccess ){
                $GLOBALS['i'] = 0;
                $GLOBALS['kituo'] = "";
                $GLOBALS['duplicate'] = array();
                $GLOBALS['newVals']  = array();
                $GLOBALS['entry']  = array();
                Excel::filter('chunk')->load($destinationPath ."/".$filename)->chunk(250, function($results)
                {
                    $duplicate = array();
                    $newVals   = array();
                    foreach($results as $row)
                    {
                        $row->toArray();
                        if(trim($row->kituo_cha_ugawaji) != ""){
                            $pieces = explode("(", trim($row->kituo_cha_ugawaji));
                            $pieces1 = explode("\\", trim($pieces[0]));
                            $pieces2 = explode("_", trim(end($pieces1)));
                            $stationmame = "";
                            $veo = "";
                            If(isset($pieces2[1])){
                                $stationmame = $pieces2[1];
                            }If(isset($pieces2[2])){
                                $veo = $pieces2[2];
                            }
                            if($GLOBALS['kituo'] == $stationmame){

                            }else{
                                $GLOBALS['kituo'] = $stationmame;
                                if(Station::where('village', Input::get('village'))->where('name',trim($stationmame))->first()){

                                }else{
                                    Station::create(array(
                                        'name' => strtolower(trim($stationmame)),
                                        'region' => Input::get('region'),
                                        'district' => Input::get('district'),
                                        'ward' => Input::get('ward'),
                                        'village' => Input::get('village'),
                                    ));
                                }
                            }

                            $kaya = array(
                                'id'                      => trim($row->id),
//                          'simu'                    => trim($row->simu),
//                          'jina_la_mkuu_wa_kaya'    => trim($row->jina_la_mkuu_wa_kaya),
                                'me'                      => (trim($row->me) == "")?0:trim($row->me),
                                'ke'                      =>  (trim($row->ke) == "")?0:trim($row->ke),
                                'kituo_cha_ugawaji'       => strtolower(trim($stationmame)),
                                'jina_la_veo'             => strtolower(trim($veo)),
//                          'mwandishi'             => trim($row->mwandishi)
                            );

                            if(count(DB::table($GLOBALS['table'])->where('uid',trim($row->id))->get()) != 0){
                                array_push($GLOBALS['duplicate'],$kaya);
                                $nets = intval(round((($kaya['me'] + $kaya['ke'])/2), 0, PHP_ROUND_HALF_UP));
                                array_push($GLOBALS['entry'],array(
                                    'uid' => trim($kaya['id']),
//                                'leader_name' => trim($kaya['jina_la_mkuu_wa_kaya']),
//                                'phone' => trim($kaya['simu']),
                                    'male' => trim($kaya['me']),
                                    'female' => trim($kaya['ke']),
                                    'nets'   => $nets,
                                    'station' => $kaya['kituo_cha_ugawaji'],
                                    'name_of_veo' => $kaya['jina_la_veo'],
//                                'writer' => trim($kaya['mwandishi']),
                                    'region' => Input::get('region'),
                                    'district' => Input::get('district'),
                                    'ward' => Input::get('ward'),
                                    'entry' => 'imported',
                                    'village' => Input::get('village')
                                ));
//                                DB::table($GLOBALS['table'])->insert(array(
//                                    'uid' => trim($kaya['id']),
////                                'leader_name' => trim($kaya['jina_la_mkuu_wa_kaya']),
////                                'phone' => trim($kaya['simu']),
//                                    'male' => trim($kaya['me']),
//                                    'female' => trim($kaya['ke']),
//                                    'nets'   => $nets,
//                                    'station' => $kaya['kituo_cha_ugawaji'],
//                                    'name_of_veo' => $kaya['jina_la_veo'],
////                                'writer' => trim($kaya['mwandishi']),
//                                    'region' => Input::get('region'),
//                                    'district' => Input::get('district'),
//                                    'ward' => Input::get('ward'),
//                                    'entry' => 'imported',
//                                    'village' => Input::get('village')
//                                ));
                            }else{
                                $nets = intval(round((($kaya['me'] + $kaya['ke'])/2), 0, PHP_ROUND_HALF_UP));
                                array_push($GLOBALS['newVals'],$kaya);
                                array_push($GLOBALS['entry'],array(
                                    'uid' => trim($kaya['id']),
//                                'leader_name' => trim($kaya['jina_la_mkuu_wa_kaya']),
//                                'phone' => trim($kaya['simu']),
                                    'male' => trim($kaya['me']),
                                    'female' => trim($kaya['ke']),
                                    'nets'   => $nets,
                                    'station' => $kaya['kituo_cha_ugawaji'],
                                    'name_of_veo' => $kaya['jina_la_veo'],
//                                'writer' => trim($kaya['mwandishi']),
                                    'region' => Input::get('region'),
                                    'district' => Input::get('district'),
                                    'ward' => Input::get('ward'),
                                    'entry' => 'imported',
                                    'village' => Input::get('village')
                                ));
//                                DB::table($GLOBALS['table'])->insert(array(
//                                    'uid' => trim($kaya['id']),
////                                'leader_name' => trim($kaya['jina_la_mkuu_wa_kaya']),
////                                'phone' => trim($kaya['simu']),
//                                    'male' => trim($kaya['me']),
//                                    'female' => trim($kaya['ke']),
//                                    'nets'   => $nets,
//                                    'station' => $kaya['kituo_cha_ugawaji'],
//                                    'name_of_veo' => $kaya['jina_la_veo'],
////                                'writer' => trim($kaya['mwandishi']),
//                                    'region' => Input::get('region'),
//                                    'district' => Input::get('district'),
//                                    'ward' => Input::get('ward'),
//                                    'entry' => 'imported',
//                                    'village' => Input::get('village')
//                                ));
                            }
                        }

                    }
//
                });
                DB::table($GLOBALS['table'])->insert($GLOBALS['entry']);
                $retunArr = array("duplicates"=>$GLOBALS['duplicate'],"newValue"=>$GLOBALS['newVals']);
                echo json_encode($retunArr);


            }
        }else{
            echo "no file";
        }
    }

    /**
     * Display a listing of Regions.
     *
     * @return Response
     */
    public function getRegions()
    {
        return Region::all();
    }

    /**
     * Display a listing of Districts.
     *
     * @return Response
     */
    public function getDistricts()
    {
        return District::all();
    }

    /**
     * Display a listing of Districts for specific region.
     *
     * @param int $regid
     * @return Response
     */
    public function getregDistricts($regid)
    {
        return District::where('region_id',$regid)->get();
    }

    /**
     * Display a listing of Wards for specific district.
     *
     * @param int $disid
     * @return Response
     */
    public function getwardDistricts($disid)
    {
        return Ward::where('district_id',$disid)->orderBy('name','ASC')->get();
    }

    /**
     * Display a listing of Villages for specific ward.
     *
     * @param int $wardid
     * @return Response
     */
    public function getVillageWard($wardid)
    {
        return Village::where('ward_id',$wardid)->orderBy('name','ASC')->get();
    }

    /**
     * Display a listing of Stations for specific village.
     *
     * @param int $villageId
     * @return Response
     */
    public function getVillageStation($villageId)
    {
        return Station::where('village',$villageId)->orderBy('name','ASC')->get();
    }

    /**
     * Display a listing of kaya for specific region.
     *
     * @param int $regid
     * @return Response
     */
    public function getregKaya($regid)
    {
        $region = Region::find(Input::get('region'));
        $table = strtolower(str_replace(" ","_",$region->region));
        return DB::table(strtolower($table))->where('region',$regid)->get();

    }

    /**
     * Display a listing of kaya for specific district.
     *
     * @param int $disid
     * @return Response
     */
    public function getdisKaya($disid)
    {
        $region = District::get($disid)->region;
        $table = strtolower(str_replace(" ","_",$region->region));
        return DB::table(strtolower($table))->where('district',$disid)->get();
    }

    /**
     * Display a listing of kaya for specific district.
     *
     * @param int $disid
     * @return Response
     */
    public function getpeopleInkaya($disid)
    {
        $region = Region::find(District::find($disid)->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $array = array();
        $array['name'] = District::find($disid)->district;
        $array['male'] =  DB::table(strtolower($table))->where('district',$disid)->sum('male');
        $array['female'] =  DB::table(strtolower($table))->where('district',$disid)->sum('female');
        $array['nets'] =  DB::table(strtolower($table))->where('district',$disid)->sum('nets');
        $array['kaya'] =  DB::table(strtolower($table))->where('district',$disid)->count();
        $array['done'] =  DB::table(strtolower($table))->where('district',$disid)->where('status',1)->count();
        $array['not_done'] =  DB::table(strtolower($table))->where('district',$disid)->where('status',0)->count();
        $array['total'] = $array['male'] + $array['female'];
        return json_encode($array);
    }

    /**
     * Display a listing of kaya for specific district.
     *
     * @param int $regid
     * @return Response
     */
    public function getpeopleInRegion($regid)
    {
        $region = Region::find($regid);
        $table = strtolower(str_replace(" ","_",$region->region));
        $array = array();
        $array['male'] =  DB::table(strtolower($table))->where('region',$regid)->sum('male');
        $array['female'] =  DB::table(strtolower($table))->where('region',$regid)->sum('female');
        $array['nets'] =  DB::table(strtolower($table))->where('region',$regid)->sum('nets');
        $array['kaya'] =  DB::table(strtolower($table))->where('region',$regid)->count();
        $array['done'] =  DB::table(strtolower($table))->where('region',$regid)->where('status',1)->count();
        $array['not_done'] =  DB::table(strtolower($table))->where('region',$regid)->where('status',0)->count();
        $array['total'] = $array['male'] + $array['female'];
        return json_encode($array);
    }

    /**
     * Display a summary distribution for a ward.
     *
     * @param int $wardId
     * @return Response
     */
    public function getpeopleInWard($wardId)
    {
        $region = Region::find(District::find((Ward::find($wardId)->district_id))->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $array = array();
        $array['male'] =  DB::table(strtolower($table))->where('ward',$wardId)->sum('male');
        $array['female'] =  DB::table(strtolower($table))->where('ward',$wardId)->sum('female');
        $array['nets'] =  DB::table(strtolower($table))->where('ward',$wardId)->sum('nets');
        $array['kaya'] =  DB::table(strtolower($table))->where('ward',$wardId)->count();
        $array['done'] =  DB::table(strtolower($table))->where('ward',$wardId)->where('status',1)->count();
        $array['not_done'] =  DB::table(strtolower($table))->where('ward',$wardId)->where('status',0)->count();
        $array['total'] = $array['male'] + $array['female'];
        return json_encode($array);
    }


    /**
     * Display a summary distribution for a village.
     *
     * @param int $vilId
     * @return Response
     */
    public function getpeopleInVillage($vilId)
    {
        $region = Region::find(District::find((Ward::find(Village::find($vilId)->ward_id)->district_id))->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $array = array();
        $array['male'] =  DB::table(strtolower($table))->where('village',$vilId)->sum('male');
        $array['female'] =  DB::table(strtolower($table))->where('village',$vilId)->sum('female');
        $array['nets'] =  DB::table(strtolower($table))->where('village',$vilId)->sum('nets');
        $array['kaya'] =  DB::table(strtolower($table))->where('village',$vilId)->count();
        $array['done'] =  DB::table(strtolower($table))->where('village',$vilId)->where('status',1)->count();
        $array['not_done'] =  DB::table(strtolower($table))->where('village',$vilId)->where('status',0)->count();
        $array['total'] = $array['male'] + $array['female'];
        return json_encode($array);
    }




    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param id
     * @return Response
     */
    public function village($id)
    {
        $arr = array();
        $village = Village::find($id);
        $region = Region::find(District::find((Ward::find(Village::find($id)->ward_id)->district_id))->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $arr['id'] = $village->id;
        $arr['village'] = $village->name;
        $arr['derlivery_status'] = $village->derlivery_status;
        $arr['derlivery_date'] = $village->derlivery_date;
        $arr['derlivery_name'] = $village->derlivery_name;
        $arr['net_derlivered'] = $village->net_derlivered;
        $arr['households'] = (DB::table(strtolower($table))->where('village',$village->id)->get()->count() != 0)?DB::table(strtolower($table))->where('village',$village->id)->count():0;
        $arr['me'] = (DB::table(strtolower($table))->where('village',$village->id)->get()->count() != 0)?DB::table(strtolower($table))->where('village',$village->id)->sum('male'):0;
        $arr['ke'] = (DB::table(strtolower($table))->where('village',$village->id)->get()->count() != 0)?DB::table(strtolower($table))->where('village',$village->id)->sum('female'):0;
        $arr['leader_name'] = (DB::table(strtolower($table))->where('village',$village->id)->get()->count() != 0)?DB::table(strtolower($table))->where('village',$village->id)->first()->leader_name:"";
        return json_encode($arr);
    }


    /**
     * Save the delivery information of kaya.
     *
     * @return Response
     */
    public function saveDelivery()
    {
        $region = Region::find(District::find((Ward::find(Village::find(Input::get('village'))->ward_id)->district_id))->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $kaya = Village::find(Input::get('village'));
        $kaya->derlivery_status = 1;
        DB::table(strtolower($table))->where('id', 1)->update(array('derlivery_date' => Input::get('derlivery_date')));
        DB::table(strtolower($table))->where('id', 1)->update(array('derlivery_name' => Input::get('derlivery_name')));
        DB::table(strtolower($table))->where('id', 1)->update(array('net_derlivered' => Input::get('net_derlivered')));
//        $kaya->save();
        return $kaya;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $region = Region::find(Input::get('region'));
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $nets = intval(round(((Input::get('female') + Input::get('male'))/2), 0, PHP_ROUND_HALF_UP));
        DB::table(strtolower($table))->insert(array(
            'uid' => Input::get('uid'),
            'male' => Input::get('male'),
            'female' => Input::get('female'),
            'nets'   => $nets,
            'station' => Input::get('station'),
            'name_of_veo' => Input::get('name_of_veo'),
//            'writer' => Input::get('writer'),
            'region' => Input::get('region'),
            'district' => Input::get('district'),
            'ward' => Input::get('ward'),
            'entry' => '',
            'village' => Input::get('village')
        ));
    }

    /**
     * Store a newly created district in storage.
     *
     * @param int $regid
     * @return Response
     */
    public function storeDistrict($regid)
    {
        return District::create(array(
            "region_id" => $regid,
            "district" => Input::get("val")
        ));
    }

    /**
     * Store a newly created region in storage.
     *
     * @return Response
     */
    public function storeRegion()
    {
        return Region::create(array(
            "region" => Input::get("val")
        ));
    }

    /**
     * Store a newly created ward in storage.
     *
     * @param int $disid
     * @return Response
     */
    public function storeWard($disid)
    {
        return Ward::create(array(
            "district_id" => $disid,
            "name" => Input::get("val")
        ));
    }

    /**
     * Store a newly created village in storage.
     *
     * @param int $wardId
     * @return Response
     */
    public function storeVillage($wardId)
    {
        return Village::create(array(
            "ward_id" => $wardId,
            "name" => Input::get("val")
        ));
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        return Kaya::where('uid',$id)->first();
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $nets = intval((Input::get("male") + Input::get("female")));
        $kaya = Kaya::find($id);
        $kaya->region = Input::get("region");
        $kaya->district = Input::get("district");
        $kaya->ward = Input::get("ward");
        $kaya->village = Input::get("village");
        $kaya->leader_name = Input::get("leader_name");
        $kaya->phone = Input::get("phone");
        $kaya->male = Input::get("male");
        $kaya->nets = ($nets > 5)?5:$nets;
        $kaya->female = Input::get("female");
        $kaya->station= Input::get("station");
        $kaya->name_of_veo = Input::get("name_of_veo");
        $kaya->writer = Input::get("writer");
        $kaya->save();
        return $kaya;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateStatus($id)
    {
        $kaya = Kaya::where('uid',$id)->first();
        $kaya->status = 1;
        $kaya->confirmation_date = date("d-m-Y");
        $kaya->comfirmed_by = Auth::user()->first_name." ".Auth::user()->last_name;
        $kaya->save();
        return $kaya;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateVerification($id)
    {
        $kaya = Kaya::where('uid',$id)->first();
        $kaya->verification_status = 1;
        $kaya->verified_by = Auth::user()->first_name." ".Auth::user()->last_name;
        $kaya->verification_date = date("d-m-Y");
        $kaya->save();
        return $kaya;
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $kaya = Kaya::find($id);
        $kaya->delete();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyRegion($id)
    {
        $kaya = Region::find($id);
        $kaya->delete();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyDistrict($id)
    {
        $kaya = District::find($id);
        $kaya->delete();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyWard($id)
    {
        $kaya = Ward::find($id);
        $kaya->delete();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyVillage($id)
    {
        $kaya = Village::find($id);
        $kaya->delete();
    }

    /**
     * return the details of the region.
     *
     * @param  int  $id
     * @return Response
     */
    public function RegionDetails($id)
    {
        $region = Region::find($id);
        $arr = array();
        $arr['districts'] = $region->district()->count();
        $wardcount = 0;
        $villagecount = 0;
        foreach(District::where('region_id',$id)->get() as $district){
            $wardcount += $district->ward()->count();
            foreach(Ward::where('district_id',$district->id)->get() as $ward){
                $villagecount += $ward->village()->count();
            }
        }
        $arr['ward'] = $wardcount;
        $arr['village'] = $villagecount;
        $arr['households'] = Kaya::where('region',$id)->count();;
        return json_encode($arr);
    }

    /**
     * return the details of the districts.
     *
     * @param  int  $id
     * @return Response
     */
    public function DistrictDetails($id)
    {
        $region = Region::find($id);
        $arr = array();
        $i=0;
        foreach(District::where('region_id',$id)->get() as $district){
            $villagecount = 0;
            $arr[$i]['id'] = $district->id;
            $arr[$i]['district'] = $district->district;
            $arr[$i]['ward'] = $district->ward()->count();
            foreach(Ward::where('district_id',$district->id)->get() as $ward){
                $villagecount += $ward->village()->count();
            }
            $arr[$i]['village'] = $villagecount;
            $arr[$i]['households'] = Kaya::where('district',$district->id)->count();
            $i++;
        }
        return json_encode($arr);
    }

    /**
     * return the details of the wards
     *
     * @param  int  $id
     * @return Response
     */
    public function WardDetails($id)
    {
        $arr = array();
        $i=0;
        foreach(Ward::where('district_id',$id)->get() as $ward){
            $arr[$i]['id'] = $ward->id;
            $arr[$i]['ward'] = $ward->name;
            $arr[$i]['village'] = $ward->village()->count();
            $arr[$i]['households'] = Kaya::where('ward',$ward->id)->count();
            $i++;
        }
        return json_encode($arr);
    }

    /**
     * return the details of the villages.
     *
     * @param  int  $id
     * @return Response
     */
    public function VillageDetails($id)
    {
        $arr = array();
        $i=0;
        foreach(Village::where('ward_id',$id)->get() as $village){
            $arr[$i]['id'] = $village->id;
            $arr[$i]['village'] = $village->name;
            $arr[$i]['households'] = Kaya::where('village',$village->id)->count();
            $i++;
        }
        return json_encode($arr);
    }

    /**
     * return the details of the region.
     *
     * @param  int  $id
     * @return Response
     */
    public function DistributionList($id)
    {
        return Kaya::where('village',$id)->get();
    }


    /////////////////////////////////////////////////////////////////
    ///////////editing resources ///////////////////////////////////
    ////////////////////////////////////////////////////////////////

    /**
     * edit region details.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateRegion($id)
    {
        $region = Region::find($id);
        $region->region = Input::get('val');
        $region->save();
        return $region;
    }

    /**
     * edit region details.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateDistrict($id)
    {
        $district = District::find($id);
        $district->district = Input::get('val');
        $district->save();
        return json_encode(array('id'=>$district->id,'district'=>$district->district));
    }

    /**
     * edit region details.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateWard($id)
    {
        $ward = Ward::find($id);
        $ward->name = Input::get('val');
        $ward->save();
        return json_encode(array('id'=>$ward->id,'name'=>$ward->name));
    }

    /**
     * edit region details.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateVillage($id)
    {
        $village = Village::find($id);
        $village->name = Input::get('val');
        $village->save();
        return json_encode(array('id'=>$village->id,'name'=>$village->name));
    }

    /**
     * list of wards for districts.
     *
     * @param  int  $id
     * @return Response
     */
    public function districtWardList($id)
    {
        $village = Village::find($id);
        $village->name = Input::get('val');
        $village->save();
        return json_encode(array('id'=>$village->id,'name'=>$village->name));
    }

    /**
     * Print pdf of the Distribution list.
     *
     * @param  int  $regid
     * @param  int  $disid
     * @return Response
     */
    public function generatePdf1($regid,$disid){

        $region = Region::find(District::find($disid)->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $district = District::find($disid);
        $region  = Region::find($regid);
        $villag = array();
        $j = 0;
        $regionMale = DB::table(strtolower($table))->sum('male');
        $regionFemale = DB::table(strtolower($table))->sum('female');
        $regionPopulation = $regionMale+$regionFemale;
        $districtMale = DB::table(strtolower($table))->where('district',$disid)->sum('male');
        $districtFemale = DB::table(strtolower($table))->where('district',$disid)->sum('female');
        $districtPopulation = $districtFemale+$districtMale;
        $regionNets = DB::table(strtolower($table))->sum('nets');
        $districtNets = 0;
        foreach(Ward::where('district_id',$disid)->get() as $ward){
            foreach(Village::where('ward_id',$ward->id)->get() as $village){
                $array = array();
                $villag[$j]['name'] = $village->name;
                $villag[$j]['male'] =  DB::table(strtolower($table))->where('village',$village->id)->sum('male');
                $villag[$j]['female'] =  DB::table(strtolower($table))->where('village',$village->id)->sum('female');
                $villag[$j]['nets'] =  DB::table(strtolower($table))->where('village',$village->id)->sum('nets');
                $villag[$j]['kaya'] =  DB::table(strtolower($table))->where('village',$village->id)->count();
                $villag[$j]['total'] = $villag[$j]['male'] + $villag[$j]['female'];
                $districtNets += $villag[$j]['nets'];
                $j++;
            }
        }
        sort($villag);
        //return View::make('distribution1',compact('region','district','villag'));
        $pdf = PDF::loadView('distribution1',compact('region','district','villag','regionPopulation','districtPopulation','regionNets','districtNets'));
        return $pdf->download('Distribution List.pdf'); //Download file
        //return View::make('distribution1',compact('region','district','villag','regionPopulation','districtPopulation','regionNets','districtNets'));


    }
    /**
     * Print excel of the Distribution list.
     *
     * @param  int  $regid
     * @param  int  $disid
     * @return Response
     */
    public function generateEXCEL($regid,$disid){
        $GLOBALS['disis'] = $disid;
        $region = Region::find(District::find($disid)->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
        $district = District::find($disid);
        $region  = Region::find($regid);

        $GLOBALS['tab'] = $table;
        $GLOBALS['dis'] = $district->district;
        $GLOBALS['reg'] = $region->region;
        Excel::create($GLOBALS['reg'].'_'.$GLOBALS['dis'].'_DistributionList', function($excel) {

            // Set the title
            $excel->setTitle('A distribution List for '.$GLOBALS['reg'].' Region '.$GLOBALS['dis'].' District');

            // Chain the setters
            $excel->setCreator('LLIN MRC')
                ->setCompany('HEBET TECHNOLOGIES');

            // Call them separately
            $excel->setDescription('A distribution List for '.$GLOBALS['reg'].' Region '.$GLOBALS['dis'].' District');
            $excel->sheet('Sheetname', function($sheet) {
                $j = 0;
                $villag = array();
                foreach(Ward::where('district_id',$GLOBALS['disis'])->get() as $ward){
                    foreach(Village::where('ward_id',$ward->id)->get() as $village){
                        if(Station::where('village',$village->id)->count() == 0){
                            $villag[$j]['Ward'] = $ward->name;
                            $villag[$j]['Village'] = $village->name;
                            $villag[$j]['Station'] = 'Kituo Cha ugawaji';
                            $villag[$j]['Male'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->sum('male');
                            $villag[$j]['Female'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->sum('female');
                            $villag[$j]['Total'] = $villag[$j]['Male'] + $villag[$j]['Female'];
                            $villag[$j]['Number of Coupons'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->count();
                            $villag[$j]['Number Of Nets'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->sum('nets');
                            $j++;
                        }else{
                            foreach(Station::where('village',$village->id)->get() as $station){
                                $villag[$j]['Ward'] = $ward->name;
                                $villag[$j]['Village'] = $village->name;
                                $villag[$j]['Station'] = $station->name;
                                $villag[$j]['Male'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->where('station',$station->name)->sum('male');
                                $villag[$j]['Female'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->where('station',$station->name)->sum('female');
                                $villag[$j]['Total'] = $villag[$j]['Male'] + $villag[$j]['Female'];
                                $villag[$j]['Number of Coupons'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->where('station',$station->name)->count();
                                $villag[$j]['Number Of Nets'] =  DB::table(strtolower($GLOBALS['tab']))->where('village',$village->id)->where('station',$station->name)->sum('nets');
                                $j++;
                            }
                        }

                    }
                }
                sort($villag);
                $sheet->fromArray($villag);

            });

        })->download('xlsx');


//        //return View::make('distribution1',compact('region','district','villag'));
//        $pdf = PDF::loadView('distribution1',compact('region','district','villag','regionPopulation','districtPopulation','regionNets','districtNets'));
//        return $pdf->download('Distribution List.pdf'); //Download file
//        //return View::make('distribution1',compact('region','district','villag','regionPopulation','districtPopulation','regionNets','districtNets'));


    }
    /**
     * Print pdf of the Issuing list.
     *
     * @param  int  $regid
     * @param  int  $disid
     * @param  int  $wardid
     * @param  int  $villid
     * @return Response
     */
    public function generatePdf($regid,$disid,$wardid,$villid){

        $region = Region::find(District::find($disid)->region_id);
        $table = strtolower(str_replace(" ","_",$region->region));
//        return DB::table(strtolower($table))->where('district',$disid)->get();
        $district = District::find($disid);
        $ward     = Ward::find($wardid);
        $village  = Village::find($villid);
        $kaya =  DB::table(strtolower($table))->where('region',$regid)->where('district',$disid)->where('ward',$wardid)->where('village',$villid)->orderBy('uid','ASC')->get();
        $pdf = new TCPDF();

//        $pdf->SetFont('dejavusans', '', 10);

// add a page
        $pdf->AddPage();

// writeHTML($html, $ln=true, $fill=false, $reseth=false, $cell=false, $align='')
// writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)

// create some HTML content

        $html = '<div class="row" style="margin-bottom: 25px">
    <table>
        <tr>
            <td style="width:90px">
                <img alt="Brand" src="'. asset('img/Nembo.png').'" style="height: 80px;width: 70px" class="img-rounded pull-left">
            </td>
            <td style="width: 340px">
                <h4  style="text-align:center;font-size: 12px"> WIZARA YA AFYA NA USTAWI WA JAMII</h4>
                <h4 style="text-align:center;font-size: 12px"> MPANGO WA TAIFA WA KUDHIBITI MALARIA</h4>
            </td>
            <td style="width:90px">
                <img alt="Brand" src="'. asset('img/malaria.png').'" style="height: 80px;width: 70px" class="img-rounded pull-right">
            </td>
        </tr>
    </table>
    </div>';

        $html .= '<table  style="width: 100%;margin-bottom: 10px;" cellspacing="0" cellpadding="2" >
    <tr>
        <td><b>Wilaya</b></td>
        <td style="text-decoration:underline">'. $district->district .'</td>
        <td ><b>Kata</b></td>
        <td style="text-decoration:underline">'. $ward->name .'</td>
        <td><b>Kijiji</b></td>
        <td style="text-decoration:underline">'. $village->name .'</td>
    </tr>
    <tr style="font-size:8px;">
        <td><b>Jina la VEO:</b></td>
        <td style="text-decoration:underline">'. $kaya[0]->name_of_veo .'</td>
        <td colspan="2"><b>Jina la kituo cha ugawaji:</b></td>
        <td colspan="2" style="text-decoration:underline">'.$kaya[0]->station .'</td>
    </tr>
</table>
<p style="height:20px"></p>
<table class="table table-striped table-bordered table-condensed"  cellspacing="0" cellpadding="2" border="1" >
        <thead >
        <tr>
            <th><b>ID</b></th>
            <th style="width:100px"><b>Idadi ya Wanakaya</b></th>
            <th style="width:100px"><b>Idadi ya Vyandarua</b></th>
            <th style="width:140px"><b>Jina la mpokeaji</b></th>
            <th style="width:60px"><b>Sahihi</b></th>
        </tr>
        </thead>
        <tbody>';
        $index=0;
        $j = 0; $total = 0; $total1 = 0;
        foreach($kaya as $kay){
            $total += ($kay->male + $kay->female);
            $total1 += $kay->nets;
            $total2 = $kay->male + $kay->female;
            $html.='<tr style="font-size:8px;">
    <td>'. $kay->uid .'</td>
    <td style="width:100px;text-align:center">'. $total2 .'</td>
    <td style="width:100px;text-align:center">'. $kay->nets .'</td>
    <td style="width:140px;text-align:center">____________</td>
    <td style="width:60px;text-align:center">_______</td>
</tr>';
        }
        $html .= '
<tr style="background-color: #5B9BD5;">
    <td>Jumla</td>
    <td>'. $total .'</td>
    <td>'. $total1 .'</td>
    <td></td>
    <td></td>
</tr></tbody>
</table>';
// output the HTML content
        $pdf->setFontSubsetting(false);
        $pdf->writeHTML($html, true, false, true, false, '');

        $filename = storage_path() . '/test.pdf';
        $pdf->output($filename, 'F');


        return Response::download($filename);
//        $pdf = PDF::loadView('distribution',compact('kaya','district','ward','village'));
//        return $pdf->download('Distribution List.pdf'); //Download file

    }

    public function wardd($id){
        return Ward::find($id);
    }

    public function villagee($id){
        return Village::find($id);
    }

    public function districtss($id){
        return District::find($id);
    }

    public function regionn($id){
        return Region::find($id);
    }

}
