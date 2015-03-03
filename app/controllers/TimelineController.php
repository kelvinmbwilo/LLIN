<?php

class TimelineController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Timeline::orderBy('start_date','DESC')->get();
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
		$timeline = Timeline::create(Input::all());
        $timeline->created_by = Auth::user()->first_name." ".Auth::user()->last_name;
        $timeline->save();
        return $timeline;
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

	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
        $timeline = Timeline::find($id);
        $timeline->start_date = Input::get('start_date');
        $timeline->end_date = Input::get('end_date');
        $timeline->discr = Input::get('discr');
        $timeline->save();
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $timeline = Timeline::find($id);
        $timeline->delete();
	}

    /**
	 * Completing project timeline.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function complete($id)
	{
        $timeline = Timeline::find($id);
        $timeline->status = 1;
        $timeline->save();
        return $timeline;

	}

    /**
	 * Completing project timeline.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function incomplete($id)
	{
        $timeline = Timeline::find($id);
        $timeline->status = 0;
        $timeline->save();
        return $timeline;

	}


}
