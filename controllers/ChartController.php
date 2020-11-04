<?php


class ChartController
{
    private function getBeginRange() {
        return min(intval($_POST['timeRangeFrom']), intval($_POST['timeRangeTo']));
    }

    private function getEndRange() {
        return max(intval($_POST['timeRangeFrom']), intval($_POST['timeRangeTo']));
    }

    public function actionIndex() {

        $dataPoints = array();
        // Временной диапазон во всей таблице
        $timeRange = array();


        // Получаем минимально и максимально возможное время
        date_default_timezone_set("Europe/Moscow");
        $timeRange = Chart::getTimeRange();

        // Получаем массив с данными, которые нужно отобразить
        if(count($_POST) > 0){
            $begin = $this->getBeginRange();
            $end = $this->getEndRange();

            $dataPoints = Chart::getDataInRange($begin, $end);
        } else {
            $dataPoints = Chart::getDataInRange($timeRange['maxDate'] - 3600, $timeRange['maxDate']);
        }
        $_POST = array();

        // Отображаем
        require_once ROOT . '/views/chartView.php';

        return true;

    }

}