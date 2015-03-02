<style>
    <style xmlns="http://www.w3.org/1999/html">
    .table {
        border-collapse: collapse !important;
    }
    .table-bordered th,
    .table-bordered td {
        border: 1px solid #5B9BD5 !important;

    }

    .col-sm-2,
    .col-sm-10,
    .col-sm-12,
    .col-md-12{
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;

    }
    table {
        max-width: 100%;
        background-color: transparent;
    }

    th {
        text-align: left;
    }

    .table {
        width: 100%;
        margin-bottom: 20px;
    }

    .table > thead > tr > th,
    .table > tbody > tr > th,
    .table > tfoot > tr > th,
    .table > thead > tr > td,
    .table > tbody > tr > td,
    .table > tfoot > tr > td {
        padding: 8px;
        line-height: 1.428571429;
        vertical-align: top;
        border-top: 1px solid #dddddd;
    }

    .table > thead > tr > th {
        vertical-align: bottom;
        border-bottom: 2px solid #dddddd;
    }

    .table > caption + thead > tr:first-child > th,
    .table > colgroup + thead > tr:first-child > th,
    .table > thead:first-child > tr:first-child > th,
    .table > caption + thead > tr:first-child > td,
    .table > colgroup + thead > tr:first-child > td,
    .table > thead:first-child > tr:first-child > td {
        border-top: 0;
    }

    .table > tbody + tbody {
        border-top: 2px solid #dddddd;
        font-size: 13px;
    }

    .table .table {
        background-color: #ffffff;
        font-size: 13px;
    }

    .table-condensed > thead > tr > th,
    .table-condensed > tbody > tr > th,
    .table-condensed > tfoot > tr > th,
    .table-condensed > thead > tr > td,
    .table-condensed > tbody > tr > td,
    .table-condensed > tfoot > tr > td {
        padding: 2px;
    }

    .table-bordered {
        border: 1px solid #dddddd;
    }

    .table-bordered > thead > tr > th,
    .table-bordered > tbody > tr > th,
    .table-bordered > tfoot > tr > th,
    .table-bordered > thead > tr > td,
    .table-bordered > tbody > tr > td,
    .table-bordered > tfoot > tr > td {
        border: 1px solid #dddddd;
    }

    .table-bordered > thead > tr > th,
    .table-bordered > thead > tr > td {
        border-bottom-width: 2px;
    }

    .table-striped > tbody > tr:nth-child(odd) > td,
    .table-striped > tbody > tr:nth-child(odd) > th {
        background-color: #DFEBF7;
    }

    .table-hover > tbody > tr:hover > td,
    .table-hover > tbody > tr:hover > th {
        background-color: #f5f5f5;
    }

    table col[class*="col-"] {
        position: static;
        display: table-column;
        float: none;
    }

    table td[class*="col-"],
    table th[class*="col-"] {
        display: table-cell;
        float: none;
    }

    .table > thead > .active > td,
    .table > tbody > .active > td,
    .table > tfoot > .active > td,
    .table > thead > .active > th,
    .table > tbody > .active > th,
    .table > tfoot > .active > th {
        background-color: #f5f5f5;
    }

    .table-hover > tbody > tr > .active:hover,
    .table-hover > tbody > .active:hover > td,
    .table-hover > tbody > .active:hover > th {
        background-color: #e8e8e8;
    }
    .col-sm-10 {
        width: 82.33333333333334%;
    }


    .col-sm-2 {
        width: 15.666666666666664%;
    }
    .pull-right {
        float: right!important;
    }
    tr{
        font-size: 13px;
    }
    .dotted{
        border-bottom: 1px dotted #000000;
    }
    td,th{
        padding: 0px;
        text-align: center;
    }

</style>
<div class="row" style="margin-bottom: 25px">
    <table>
        <tr>
            <td>
                <img alt="Brand" src="<?php echo asset('img/Nembo.png') ?>" style="height: 80px;width: 70px" class="img-rounded pull-left">
            </td>
            <td style="width: 550px">
                <h4 class="text-center" style="font-size: 15px"> WIZARA YA AFYA NA USTAWI WA JAMII</h4>
                <h4 class="text-center" style="font-size: 15px"> MPANGO WA TAIFA WA KUDHIBITI MALARIA</h4>
            </td>
            <td>
                <img alt="Brand" src="<?php echo asset('img/malaria.png') ?>" style="height: 80px;width: 70px" class="img-rounded pull-right">
            </td>
        </tr>
    </table>
</div>

<table style="width: 100%;margin-bottom: 10px;" >
    <tr>
        <td><b>Region</b></td>
        <td class="dotted">{{ $region->region }}</td>
        <td><b>District</b></td>
        <td class="dotted">{{ $district->district }}</td>
    </tr>

</table>
<table class="table table-striped table-bordered table-condensed" style="border-collapse: collapse;">
    <thead style="background-color: #5B9BD5; border: 0px">
    <tr style="border: 0px">
        <th>Na</th>
        <th style="border: 0px">Village</th>
        <th style="border: 0px">Number of Coupons</th>
        <th style="border: 0px">Number of Nets</th>
        <th style="border: 0px">Buffer</th>
    </tr>
    </thead>
    <tbody>
    <?php $index=0;
    $j = 0; $total = 0;$kayatotal=0;$k = 0;
    ?>
    @foreach($villag as $kay)
    <?php $j++;
    $kayatotal += $kay['kaya'];
    $total += intval(($kay['male'] + $kay['female'])/2)
    ?>
    <tr>
        <td>{{ ++$k }}</td>
        <td style="text-align: left">{{ $kay['name'] }}</td>
        <td>{{ $kay['kaya'] }}</td>
        <td>{{ intval(($kay['nets']) }}</td>
        <td></td>
    </tr>
    <?php
    if($j % 33 == 0){
        ?>
    <tr style="background-color: #7E8F7C">
        <td></td>
        <td>Jumla</td>
        <td>{{ $kayatotal }}</td>
        <td>{{ $total }}</td>
        <td></td>
    </tr>
    <p style="page-break-before: always">
    <?php
    }
    ?>
    @endforeach
    <tr>
        <td></td>
        <td>Jumla</td>
        <td>{{ $kayatotal }}</td>
        <td>{{ $total }}</td>
        <td></td>
    </tr>
    </tbody>
</table>