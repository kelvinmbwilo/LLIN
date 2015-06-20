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

    public function getCountColumn($column){
        if($column == "Redeemed Coupons"){
            return array('column'=>'status',"query"=>"count","value"=>"1");
        }elseif($column == "Non Redeemed Coupons"){
            return array('column'=>'status',"query"=>"count","value"=>"1");
        }elseif($column == "Coupons"){
            return array('column'=>'id',"query"=>"all","value"=>"1");
        }elseif($column == "Nets"){
            return array('column'=>'nets',"query"=>"sum","value"=>"1");
        }elseif($column == "Male"){
            return array('column'=>'nets',"query"=>"sum","value"=>"1");
        }elseif($column == "Female"){
            return array('column'=>'nets',"query"=>"sum","value"=>"1");
        }elseif($column == "Imported"){
            return array('column'=>'entry',"query"=>"sum","value"=>"imported");
        }elseif($column == "Verified"){
            return array('column'=>'nets',"query"=>"sum","value"=>"1");
        }elseif($column == "Delivered Nets"){
            return array('table'=>'village','column'=>'verification_status',"query"=>"count","value"=>"1");
        }elseif($column == "Required Nets"){
            return array('column'=>'nets',"query"=>"sum","value"=>"1");
        }elseif($column == "All Coupons"){
            return array('column'=>'id',"query"=>"all","value"=>"1");
        }else{
            return "";
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


}
