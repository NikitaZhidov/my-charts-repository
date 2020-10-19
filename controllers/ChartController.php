<?php


class ChartController
{

    public function actionIndex() {

        $dataPoints = array();

        // Получаем массив с данными, которые нужно отобразить
        $dataPoints = Chart::getLatestData();

        // Отображаем
        require_once ROOT . '/views/chartView.php';

        return true;

    }

}