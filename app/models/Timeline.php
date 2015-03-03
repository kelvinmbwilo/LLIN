<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 3/3/15
 * Time: 10:54 AM
 */
class Timeline extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'timeline';

    protected  $guarded = array('id');
    public $timestamps = false;


}