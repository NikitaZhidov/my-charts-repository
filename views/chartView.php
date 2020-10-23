<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../resources/css/style.css">
    <title>Charts</title>
</head>
<body>
    <div class="wrapper">

        <div id="chartContainer">
            <canvas id="myChart" width="600" height="400"></canvas>
        </div>

        <div class="select-area">
            <?php foreach ($dataPoints as $targetKey => $targetArrays): ?>
                <button class="my-btn" data-value="<?php echo $targetKey; ?>"><?php echo $targetKey; ?></button>
            <?php endforeach; ?>
            <button class="my-btn zoom-reset">zoom reset</button>
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

        // Значение для отображения
        let targetValue = Object.keys(dataPoints)[0];

    </script>
    <!--  Подключение js файла с диаграммой   -->
    <script src="../resources/js/myChart.js"></script>
</body>
</html>