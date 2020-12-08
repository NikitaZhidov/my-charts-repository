<?php


class Chart
{

    // Метод преобразущий выборку данных из бд
    // в массив, который можно использовать для графиков
    private static function getDataPoints($data, $target_values, $target_value_axisX) {
        // Массив для данных
        $data_points = [];

        // Индексы для корректного формирования массива
        $i = 1;

        // Индексы для разных массивов
        // Номер индекса - периодичность значения
        // (например, каждый 2-ой, 5-ый, 10-ый и т.д.)
        $j = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Переменная для высчитывания среднего числа
        $mean = 0;

        // Шаблон массива для подсчета суммы каждых i-ых значений
        $periodic = [2 => 0, 3 => 0, 4 => 0, 5 => 0, 6 => 0, 7  => 0, 8  => 0, 9  => 0, 10  => 0];

        // Применяем шаблон для каждого целевого значения
        $periodic_values = [];
        foreach ($target_values as $target_value) {
            $periodic_values[$target_value] = $periodic;
        }

        // "Вынимаем" необходимые данные
        // $data_points[Целевое значение][Номер массива для отображения][Индекс значения в массиве][Значение/Время]
        foreach ($data as $data_value) {

            // Заполняем массив для каждых первых значений
            foreach ($target_values as $target_value) {
                if (array_key_exists($target_value, $data_value)) {
                    $data_points[$target_value][1][$j[1]]['y'] = $data_value[$target_value];
                    $data_points[$target_value][1][$j[1]]['x'] = $data_value[$target_value_axisX];
                }
            }

            // Для каждого периодического значения вычисляем промежуточную сумму,
            // (сумма первых i-ых элементов, сумма следующих i-ых и т.д.)
            // чтобы вычислить среднее значение - это и будет периодическим значением
            foreach ($periodic as $periodic_key => $periodic_value) {

                foreach ($target_values as $target_value) {
                    if (array_key_exists($target_value, $data_value)) {
                        $periodic_values[$target_value][$periodic_key] += $data_value[$target_value];
                    }
                }

                // Формируем массивы, разного размера
                // каждый из них отвечает за подробность диаграммы
                // i == 10 -> (100/10)% значений; i == 8 -> (100/8)% значений и т. д.
                if ($i % $periodic_key == 0) {
                    foreach ($target_values as $target_value){
                        if (array_key_exists($target_value, $data_value)) {
                            $mean = $periodic_values[$target_value][$periodic_key] / $periodic_key;
                            $data_points[$target_value][$periodic_key][$j[$periodic_key]]['x'] = $data_value[$target_value_axisX];
                            $data_points[$target_value][$periodic_key][$j[$periodic_key]]['y'] = $mean;

                            $periodic_values[$target_value][$periodic_key] = 0;
                        }
                    }

                    $j[$periodic_key]++;
                }
            }


            // Инкрементируем индексы
            $j[1]++;
            $i++;
        }

        return $data_points;
    }

    // Возвращает весь возможный временной диапазон
    public static function getTimeRange() {
        $db = Db::getConnection();

        $settingsPath = ROOT.'/config/data_settings.php';
        $data_settings = include ($settingsPath);

        $time_range = array();

        $table_name = $data_settings['table_name'];
        $target_value_axisX = $data_settings['target_value_axisX'];

        // Выбираем первую секунду
        $statement = $db->select("SELECT * FROM ". $table_name
                                ." WHERE type='value_changed'"
                                ." ORDER BY ".$target_value_axisX
                                ." LIMIT 1");
        $time_range['minDate'] = $statement->fetchOne()[$target_value_axisX];

        // Выбираем последнюю секунду
        $statement = $db->select("SELECT * FROM ". $table_name
            ." WHERE type='value_changed'"
            ." ORDER BY ".$target_value_axisX . " DESC"
            ." LIMIT 1");
        $time_range['maxDate'] = $statement->fetchOne()[$target_value_axisX];


        return $time_range;
    }

    // Возвращает данные из промежутка времени
    public static function getDataInRange($begin, $end) {
        $db = Db::getConnection();
        // Получаем настройки отображения данных
        $settingsPath = ROOT.'/config/data_settings.php';
        $data_settings = include ($settingsPath);


        $table_name = $data_settings['table_name'];
        $target_values = $data_settings['target_values'];
        $target_value_axisX = $data_settings['target_value_axisX'];
        $count_values_to_display = $data_settings['count_values_to_display'];

        $countElements = $end - $begin;
        $additionalCondition = "";

        if ($countElements > $count_values_to_display) {
            $additionalCondition = " AND ($target_value_axisX - $begin) % "
                                    .round($countElements/$count_values_to_display)." = 0";
        }

        $statement = $db->select("SELECT * FROM ". $table_name
            ." WHERE type='value_changed' AND "
            .$target_value_axisX." >= $begin AND "
            .$target_value_axisX." <= $end" .$additionalCondition
            ." ORDER BY ".$target_value_axisX." DESC");

        $data = $statement->rows();

        $data = array_reverse($data);

        return self::getDataPoints($data, $target_values, $target_value_axisX);
    }

    public static function getLastData() {
        $timeRange = self::getTimeRange();
        $range = 3600;
        $random_num = rand(0, 100);
        return self::getDataInRange($timeRange['maxDate'] - $range - $random_num, $timeRange['maxDate'] - $random_num);
    }

}