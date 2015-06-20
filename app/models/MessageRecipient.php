<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 3/3/15
 * Time: 10:52 AM
 */
class MessageRecipient extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'sms_recepient';

    protected  $guarded = array('id');
    public $timestamps = false;

    public function messages(){
        return $this->hasMany('Messages', 'user_id', 'id');
    }

}