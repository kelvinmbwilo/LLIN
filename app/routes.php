<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
Route::controller('password', 'RemindersController');
Route::get('/', function()
{
    return View::make('home');
});
Route::get('login',function(){
    return View::make('login');
});

/**
 * Users
 */
//getting users
Route::get('users',array('uses'=>'UserController@index'));

//saving new user
Route::post('users',array('uses'=>'UserController@store'));

//Deleting user
Route::post('delete/user/{id}',array('uses'=>'UserController@destroy'));

//Updating  user
Route::post('user/{id}',array('uses'=>'UserController@update'));

//validating user during login
Route::post('login',array('as'=>'login', 'uses'=>'UserController@validate'));

//logging a user out
Route::get('logout',array('as'=>'logout', 'uses'=>'UserController@logout'));

//details of the logged in user
Route::get('loggenInuser',array('as'=>'logout', 'uses'=>'UserController@show'));

/**
 * Messages
 */
//getting list of message recipients
Route::get('messages_receivers',array('as'=>'logout', 'uses'=>'MessageController@index'));

//getting list of message recipients
Route::post('messages_receivers',array('as'=>'logout', 'uses'=>'MessageController@store'));

//getting list of message recipients
Route::post('messages_receivers/{id}',array('as'=>'logout', 'uses'=>'MessageController@update'));

//getting list of message recipients
Route::post('delete/recipients/{id}',array('as'=>'logout', 'uses'=>'MessageController@destroy'));

/**
 * Timeline
 */
//getting list of message recipients
Route::get('timeline',array('as'=>'logout', 'uses'=>'TimelineController@index'));

//getting list of message recipients
Route::post('timeline',array('as'=>'logout', 'uses'=>'TimelineController@store'));

//getting list of message recipients
Route::post('timeline/{id}',array('as'=>'logout', 'uses'=>'TimelineController@update'));

//getting list of message recipients
Route::post('delete/timeline/{id}',array('as'=>'logout', 'uses'=>'TimelineController@destroy'));

//getting list of message recipients
Route::post('timeline/complete/{id}',array('as'=>'logout', 'uses'=>'TimelineController@complete'));

//getting list of message recipients
Route::post('timeline/incomplete/{id}',array('as'=>'logout', 'uses'=>'TimelineController@incomplete'));

/**
 * Uploading the file with households
 */

//saving uploaded  kaya
Route::post('upload',array('uses'=>'kayaController@upload'));

//searching for kaya
Route::post('search/kaya',array('uses'=>'kayaController@searchResult'));

/////////////////////////////////////////////////////////////
//getting kaya
Route::post('getkaya',array('uses'=>'kayaController@index'));

//getting regions
Route::get('regions',array('uses'=>'kayaController@getRegions'));

//getting Districts
Route::get('districts',array('uses'=>'kayaController@getDistricts'));

//getting Single ward Details
Route::get('village/{id}',array('uses'=>'kayaController@village'));

//adding new kaya
Route::post('kaya',array('uses'=>'kayaController@store'));

//adding new kaya
Route::post('kaya/derlivery',array('uses'=>'kayaController@saveDelivery'));

//updating kaya
Route::post('kaya/{id}',array('uses'=>'kayaController@update'));

//updating kaya distribution status
Route::post('kaya/{id}/distribute',array('uses'=>'kayaController@updateStatus'));

//updating kaya verification status
Route::post('kaya/{id}/verify',array('uses'=>'kayaController@updateVerification'));

//getting single kaya Information
Route::get('kaya/{id}',array('uses'=>'kayaController@show'));

//getting  wards from specific district
Route::get('wards/district/{id}',array('uses'=>'kayaController@getwardDistricts'));

//getting  villages from specific ward
Route::get('village/ward/{id}',array('uses'=>'kayaController@getVillageWard'));

//getting  stations from specific villages
Route::get('village/station/{id}',array('uses'=>'kayaController@getVillageStation'));

//deleting kaya
Route::post('kaya/delete/{id}',array('uses'=>'kayaController@destroy'));

//getting kaya for specific region
Route::get('kaya/region/{id}',array('uses'=>'kayaController@getregKaya'));

//getting kaya for specific district
Route::get('kaya/district/{id}',array('uses'=>'kayaController@getdisKaya'));

//getting districts for specific region
Route::get('districts/region/{id}',array('uses'=>'kayaController@getregDistricts'));

//getting people for specific region
Route::get('people/region/{id}',array('uses'=>'kayaController@getpeopleInRegion'));

//getting people for specific region
Route::get('people/village/{id}',array('uses'=>'kayaController@getpeopleInVillage'));

//getting people for specific region
Route::get('people/ward/{id}',array('uses'=>'kayaController@getpeopleInWard'));

//getting people for specific region
Route::get('people/district/{id}',array('uses'=>'kayaController@getpeopleInkaya'));


////////////////////////////////////////////////////////////////////////////////
////////////////////////adding organisation units /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//adding new kaya
Route::post('region',array('uses'=>'kayaController@storeRegion'));

//adding new kaya
Route::post('adddistrict/{id}',array('uses'=>'kayaController@storeDistrict'));

//adding new kaya
Route::post('addward/{id}',array('uses'=>'kayaController@storeWard'));

//adding new kaya
Route::post('addvillage/{id}',array('uses'=>'kayaController@storeVillage'));

//getting region details
Route::get('regiondetails/{id}',array('uses'=>'kayaController@RegionDetails'));


//getting districts details ---- taking regionID ----
Route::get('districtdetails/{id}',array('uses'=>'kayaController@DistrictDetails'));

//getting wards details ---taking district ID----
Route::get('warddetails/{id}',array('uses'=>'kayaController@WardDetails'));

//getting village details ---taking ward ID----
Route::get('villagedetails/{id}',array('uses'=>'kayaController@VillageDetails'));

/////////////////////////////////////////////////////////////////////////
/////////////////////////updating adminstative units////////////////////
////////////////////////////////////////////////////////////////////////
//eddit region
Route::post('edit/region/{id}',array('uses'=>'kayaController@updateRegion'));

//eddit district
Route::post('edit/district/{id}',array('uses'=>'kayaController@updateDistrict'));

//eddit ward
Route::post('edit/ward/{id}',array('uses'=>'kayaController@updateWard'));

//eddit village
Route::post('edit/village/{id}',array('uses'=>'kayaController@updateVillage'));

//Deleting region
Route::post('delete/region/{id}',array('uses'=>'kayaController@destroyRegion'));

//Deleting district
Route::post('delete/district/{id}',array('uses'=>'kayaController@destroyDistrict'));

//Deleting ward
Route::post('delete/ward/{id}',array('uses'=>'kayaController@destroyWard'));

//Deleting village
Route::post('delete/village/{id}',array('uses'=>'kayaController@destroyVillage'));

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////generating pdf /////////////////////////////////
//getting distribution list
Route::get('distribution_list1/{regid}/{disid}',array('uses'=>'kayaController@generatePdf1'));
Route::get('distribution_list2/{regid}/{disid}',array('uses'=>'kayaController@generateEXCEL'));

//getting issuing list
Route::get('distribution_list/{regid}/{disid}/{wardid}/{villid}',array('uses'=>'kayaController@generatePdf'));

//getting ward details
Route::get('warddd/{id}',array('uses'=>'kayaController@wardd'));

//getting ward details
Route::get('regionn/{id}',array('uses'=>'kayaController@regionn'));

//getting ward details
Route::get('districtss/{id}',array('uses'=>'kayaController@districtss'));

//getting ward details
Route::get('villagee/{id}',array('uses'=>'kayaController@villagee'));

//getting ward details
Route::get('excel',array('uses'=>'ReportController@downloadExcel'));

//getting ward details
Route::post('excel',array('uses'=>'ReportController@downloadExcel'));

//getting ward details
Route::post('getReportValue',array('uses'=>'ReportController@getCountColumn'));

//getting ward details
Route::get('couponSummary/{id}',array('uses'=>'ReportController@getCouponSummary'));

