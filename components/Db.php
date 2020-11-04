<?php


class Db
{

    public static function getConnection() {

        $paramsPath = ROOT.'/config/db_params.php';
        $params = include($paramsPath);
        $db = new ClickHouseDB\Client($params);
        $db->database($params['dbname']);

        return $db;


    }

}