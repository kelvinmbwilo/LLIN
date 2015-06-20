<?php
/**
 * Created by PhpStorm.
 * User: kelvin
 * Date: 3/3/15
 * Time: 10:52 AM
 */
class Messages extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'messages';

    protected  $guarded = array('id');
    public $timestamps = false;

    public function messages(){
        return $this->belongsTo('MessageRecipient', 'user_id', 'id');
    }

}