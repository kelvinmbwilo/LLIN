<!DOCTYPE html>
<html lang="en">
<head>
    <title>LLIN MRC DATABASE</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="icon" type="image/ico" href="http://aqvatarius.com/themes/taurus_v12/html/favicon.ico"/>

    <link href="<?php echo asset("css/stylesheets.css") ?>" rel="stylesheet" type="text/css" />

    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery-ui.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/jquery-migrate.min.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/jquery/globalize.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/plugins/bootstrap/bootstrap.min.js") ?>'></script>

    <script type='text/javascript' src='<?php echo asset("js/plugins/uniform/jquery.uniform.min.js") ?>'></script>

    <script type='text/javascript' src='<?php echo asset("js/plugins.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/actions.js") ?>'></script>
    <script type='text/javascript' src='<?php echo asset("js/settings.js") ?>'></script>
</head>
<body class="bg-img-num15">

<div class="container">

    <div class="login-block">
        <div class="block block-transparent">
            <div class="head">
                <div class="user">
                    <div class="info user-change">
                        <img src="<?php echo asset("img/net.png") ?>" class="img-circle img-thumbnail"/>
                        <div class="user-change-button">
<!--                            <span class="icon-off"></span>-->
                        </div>
                    </div>
                </div>
            </div>
            @if(isset($error))
            <div class="alert alert-danger alert-dismissable" style="padding: 5px">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>{{ $error }}!</strong>
            </div>
            @endif
            <div class="content controls npt">
                <div class="form-row">
                    <div class="col-md-12 tac"><h3>LLIN MRC DATABASE</h3></div>
                </div>

                <form method="post" action="{{ url('login') }}" style="" autocomplete="off">
                <div class="form-row user-change-row">
                    <div class="col-md-12">
                        <div class="input-group">
                            <div class="input-group-addon">
                                <span class="icon-user"></span>
                            </div>
                            <input name="email" type="text" class="form-control" placeholder="Username"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12">
                        <div class="input-group">
                            <div class="input-group-addon">
                                <span class="icon-key"></span>
                            </div>
                            <input name="password" type="password" class="form-control" placeholder="Password"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-default btn-block btn-clean">Log In</button>

                    </div>
                </div>
                </form>
                <div class="form-row">
                    <div class="col-md-12">
                        <a href="{{ url('password/remind/') }}" class="btn btn-link btn-block">Forgot your password?</a>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-6">
                        <a href="http://www.usaid.gov/" target="_blank">
                            <img src="<?php echo asset("img/usaid.png") ?>" class="img-responsive img-thumbnail"/>
                        </a>
                    </div>
                    <div class="col-md-6">
                        <a href="http://www.theglobalfund.org/" target="_blank">
                           <img src="<?php echo asset("img/globalfund.png") ?>" class="img-responsive img-thumbnail"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

</body>
</html>