<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 1/19/15
 * Time: 11:04 PM
 */
class Village extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'village';

    protected  $guarded = array('id');
    public $timestamps = false;

    public function ward(){
        return $this->belongsTo('Ward', 'ward_id', 'id');
    }

    public function district(){
        return $this->belongsTo('District', 'district_id', 'id');
    }
}