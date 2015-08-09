<?php

class ReportController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{

	}

    /**
	 * Display a column for fetching data.
	 *
     * @param areaType
	 * @return String column
	 */
	public function getAreaColumn($areaType)
	{
        if($areaType == "Regions"){
            return "region";
        }if($areaType == "Districts"){
            return "district";
        }if($areaType == "Wards"){
            return "ward";
        }if($areaType == "Village"){
            return "village";
        }
	}

    /**
     * Display a column for fetching data.
     *
     * @param areaType
     * @param int
     * @return String table
     */
    public function getBaseTable($id,$areaType)
    {
        if($areaType == "Regions"){
            $region =  Region::find($id);
            return strtolower(str_replace(" ","_",$region->region));;
        }if($areaType == "Districts"){
            $region = Region::find(District::find($id)->region_id);
            return strtolower(str_replace(" ","_",$region->region));
        }if($areaType == "Wards"){
            $region = Region::find(District::find((Ward::find($id)->district_id))->region_id);
            return strtolower(str_replace(" ","_",$region->region));
        }if($areaType == "Village"){
            $region = Region::find(District::find((Ward::find(Village::find($id)->ward_id)->district_id))->region_id);
            return strtolower(str_replace(" ","_",$region->region));
        }
    }

    public function getCountColumn(){
        $column   = Input::get('category_value');
        $id       =Input::get('id');
        $areaType   = Input::get('area');
        $table = $this->getBaseTable($id,$areaType);
        $areaColumn = $this->getAreaColumn($areaType);
        if($column == "Redeemed Coupons"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',1)->count();
        }elseif($column == "Non Redeemed Coupons"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',0)->count();
        }elseif($column == "Coupons"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->count();
        }elseif($column == "Nets"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',1)->sum('nets');
        }elseif($column == "Male"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',1)->sum('male');
        }elseif($column == "Female"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',1)->sum('female');
        }elseif($column == "Imported"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('entry','imported')->count();
        }elseif($column == "Verified"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('verification_status','')->count();
        }elseif($column == "Delivered Nets"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('verification_status','1')->count();
        }elseif($column == "Required Nets"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->where('status',1)->sum('nets');
        }elseif($column == "All Coupons"){
            return DB::table(strtolower($table))->where($areaColumn,$id)->count();
        }else{
            //return "http://www.jqueryslidershock.com/";
        }
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
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
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
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @return Response
	 */
	public function downloadExcel()
	{
        Excel::create('New file', function($excel) {

            $excel->sheet('New sheet', function($sheet) {

                $sheet->loadView('excel')->with('key', 'value');

            });

//        })->download('xls');
        })->export('pdf');
	}


/**
	 *get a summary of coupon distribution per district
	 * @param $id
	 * @return Response
	 */
	public function getCouponSummary($id)
	{
        $table = $this->getBaseTable($id,"Districts");
        $areaColumn = $this->getAreaColumn("Districts");
        $nets = DB::table(strtolower($table))->where($areaColumn,$id)->select(DB::raw('male+female as count'))->get();
        return $nets;
	}

    /**
	 *clean coupon per region.
	 * @param $id
	 * @return Response
	 */
	public function cleanCoupon($id)
	{
        $table = $this->getBaseTable($id,"Regions");
        $nets = DB::table(strtolower($table))->get();
        $i = 0;
        foreach($nets as $colum){
            $i++;
            if($colum->writer != '1'){
                $net1 = intval(round((($colum->male + $colum->female)/2), 0, PHP_ROUND_HALF_UP));

                DB::table(strtolower($table))
                    ->where('id', $colum->id)
                    ->update(array('nets' => $net1,'writer' => '1'));
            }

        }

        echo "updates ". $i." Colums";
	}

}
