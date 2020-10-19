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
        <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        <div class="select-area">
            <button class="stddev-btn my-btn" data-value="stdDev">stdDev</button>
            <button class="mean-btn my-btn" data-value="mean">mean</button>
            <button class="maxdev-btn my-btn" data-value="maxDev">maxDev</button>
        </div>
    </div>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
    <script type="text/javascript">
        let dataPoints = <?php echo json_encode($dataPoints, JSON_NUMERIC_CHECK); ?>;
        console.log(dataPoints);
    </script>
    <script src="../resources/js/chart.js"></script>
</body>
</html>