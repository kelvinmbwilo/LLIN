<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 1/13/15
 * Time: 3:47 PM
 */
class Kaya extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'kaya';

    protected  $guarded = array('id');

    public function getDistrict(){
        return $this->belongsTo('District', 'district', 'id');
    }

    public function getRegion(){
        return $this->belongsTo('Region', 'region', 'id');
    }

    public function getStation(){
        return $this->belongsTo('Station', 'station', 'id');
    }

}