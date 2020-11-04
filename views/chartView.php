<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp" crossorigin="anonymous">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../resources/css/style.css">
    <link rel="stylesheet" href="../resources/css/calendar.css">
    <title>Charts</title>
</head>
<body>
    <div class="wrapper">

        <div class="serverResponse"></div>
        <div id="chartContainer">
            <canvas id="myChart" width="600" height="400"></canvas>
        </div>

        <div class="select-wrapper">
            <div class="select-area">
                <?php foreach ($dataPoints as $targetKey => $targetArrays): ?>
                    <button class="my-btn my-btn-style" data-value="<?php echo $targetKey; ?>"><?php echo $targetKey; ?></button>
                <?php endforeach; ?>
                <button class="my-btn my-btn-style zoom-reset">zoom reset</button>
            </div>
            <div class="select-area">
                <button class="timerange-btn my-btn-style">Выбрать диапазон</button>
                <div class="timerange-area hide">
                    <span class="timerange-close">&times;</span>
                    <div class="timerange-area-row">
                        <div class="timerange-area__item">
                            <button class="select-date-btn my-btn-style" id="from" data-timebtn="from">
                                <?php echo date('d.m.Y H:i', $dataPoints['stdDev'][1][0]['x']); ?>
                            </button>
                        </div>
                        <div class="timerange-area__item">
                            <button class="select-date-btn my-btn-style" id="to" data-timebtn="to">
                                <?php echo date('d.m.Y H:i', $dataPoints['stdDev'][1][count($dataPoints['stdDev'][1])-1]['x']); ?>
                            </button>
                        </div>
                    </div>
                    <div class="timerange-area-row">
                        <form action="<?php ROOT . '/public' ?>" method="post">
                            <input class="timerange-input" value="<?php echo $dataPoints['stdDev'][1][0]['x']; ?>" name="timeRangeFrom" id="timeRangeFrom">
                            <input class="timerange-input" value="<?php echo $dataPoints['stdDev'][1][count($dataPoints['stdDev'][1])-1]['x']; ?>" name="timeRangeTo" id="timeRangeTo">
                            <button type="submit" class="timerange-input-btn my-btn-style">Просмотр</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="cal-modal hide">
        <div class="cal-modal-overlay" data-hide="true">
            <div class="cal-wrapper">
                <div class="container-calendar">
                <div class="cal">
                    <div class="cal__month">
                        <i class="fas fa-angle-left cal-prev"></i>
                        <div class="cal__date">
                            <h2></h2>
                            <h1></h1>
                            <p></p>
                        </div>
                        <i class="fas fa-angle-right cal-next"></i>
                    </div>
                    <div class="cal__body">
                        <div class="cal__weekdays">
                            <div>Пн</div>
                            <div>Вт</div>
                            <div>Ср</div>
                            <div>Чт</div>
                            <div>Пт</div>
                            <div>Сб</div>
                            <div>Вс</div>
                        </div>
                        <div class="cal__days">
                        </div>
                        <div class="cal__time">
                            <div class="cal__time-col">
                                <div class="cal__time-name">Часы</div>
                                <select name="hour" id="selected-hour" class="select-time">
                                </select>
                            </div>
                            <div class="cal__time-col">
                                <div class="cal__time-name">Минуты</div>
                                <select name="minutes" id="selected-minutes" class="select-time">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="cal__footer">
                        <button class="cal__accept-btn my-btn-style">Применить</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>

    <!--  Подключение необходимых библиотек  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js" integrity="sha512-d9xgZrVZpmmQlfonhQUvTR7lMPtO7NkZMkA0ABN3PHCbKA5nqylQ/yWlFAyY6hYgdF1Qh6nYiuADWwKB4C2WSw==" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@0.7.7"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.27.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@0.1.1"></script>

    <script type="text/javascript">

        // Данные
        let dataPoints = <?php echo json_encode($dataPoints, JSON_NUMERIC_CHECK); ?>;

        let timeRange = <?php echo json_encode($timeRange, JSON_NUMERIC_CHECK); ?>;

        // Значение для отображения
        let targetValue = Object.keys(dataPoints)[0];

        console.log(dataPoints);
    </script>
    <!--  Подключение js файла с диаграммой   -->
    <script src="../resources/js/myChart.js"></script>

    <!--  Дополнительный javascript  -->
    <script src="../resources/js/calendar.js"></script>
    <script src="../resources/js/main.js"></script>
</body>
</html>