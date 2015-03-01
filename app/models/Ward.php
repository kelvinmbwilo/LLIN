<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 1/19/15
 * Time: 11:04 PM
 */
class Ward extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ward';

    protected  $guarded = array('id');
    public $timestamps = false;

    public function district(){
        return $this->belongsTo('District', 'district_id', 'id');
    }

    public function village(){
        return $this->hasMany('Village', 'ward_id', 'id');
    }
}