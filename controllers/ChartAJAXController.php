<?php

class ChartAJAXController
{
    private function getBeginRange() {
        return min(intval($_POST['timeRangeFrom']), intval($_POST['timeRangeTo']));
    }

    private function getEndRange() {
        return max(intval($_POST['timeRangeFrom']), intval($_POST['timeRangeTo']));
    }

    public function actionIndex()
    {
        $dataPoints = array();

        // Получаем массив с данными, которые нужно отобразить
        if (count($_POST) > 0) {
            $begin = $this->getBeginRange();
            $end = $this->getEndRange();
            $dataPoints = Chart::getDataInRange($begin, $end);
        }
        $_POST = array();

        echo json_encode($dataPoints);
    }
}