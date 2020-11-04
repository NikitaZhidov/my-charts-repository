<?php
    // Обращаемся только при ajax запросах

    //  Корневой каталог
    define('ROOT', dirname(__FILE__).'/..');
    //  Автозагрузка классов
    require_once ROOT . '/vendor/autoload.php';
    require_once ROOT . '/components/Autoload.php';

    //    Отображение ошибок
    ini_set('display_errors', 1);

    $chart = new ChartAJAXController();
    $chart->actionIndex();
