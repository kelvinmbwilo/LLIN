<?php

class UserController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        return User::all();
//        foreach(Region::all() as $region){
//            if (!Schema::hasTable(str_replace(" ","_",$region->region)))
//            {
//                Schema::create(str_replace(" ","_",$region->region), function($table)
//                {
//                    $table->increments('id');
//                    $table->integer('uid');
//                    $table->integer('region');
//                    $table->integer('district');
//                    $table->integer('ward');
//                    $table->integer('village');
//                    $table->integer('male');
//                    $table->integer('female');
//                    $table->integer('nets');
//                    $table->string('station');
//                    $table->string('name_of_veo');
//                    $table->string('writer');
//                    $table->integer('status');
//                    $table->string('entry');
//                    $table->string('comfirmed_by');
//                    $table->string('confirmation_date');
//                    $table->string('verification_status');
//                    $table->string('verified_by');
//                    $table->timestamps();
//                    $table->index('uid');
//                    $table->index('region');
//                    $table->index('district');
//                    $table->index('ward');
//                    $table->index('village');
//                    $table->index('male');
//                    $table->index('female');
//                    $table->index('nets');
//                    $table->index('station');
//                    $table->index('name_of_veo');
//                    $table->index('writer');
//                    $table->index('status');
//                    $table->index('entry');
//                });
//            }
//
//        }
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
		return User::create(Input::all());
	}


	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function show()
	{
		return Auth::user();
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
		$user = User::find($id);
        $user->first_name = Input::get('first_name');
        $user->last_name = Input::get('last_name');
        $user->phone = Input::get('phone');
        $user->email = Input::get('email');
        $user->username = Input::get('username');
        $user->role = Input::get('role');
        $user->gender = Input::get('gender');
        $user->save();
        return $user;
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$user = User::find($id);
        $user->delete();

	}

    /**
     * authanticate user during login.
     *
     * @return view
     */
    public function validate()
    {
//        $user = User::where("email",Input::get('email'))->first();
        $user = User::where("username",Input::get('email'))->first();
        if($user && Input::get('password',$user->password)){
                Auth::login($user,TRUE);

            if(Auth::check()){

                return Redirect::to("/");
            }
        }
        else{
            return View::make("login")->with("error","Incorrect Username or Password");
        }
    }

    /**
     * loging out a user
     *
     * @return view
     */
    public function logout(){
        Auth::logout();
        return Redirect::to("login");
    }



}
