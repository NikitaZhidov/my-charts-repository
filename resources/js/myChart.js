
if (dataPoints.length < 1)
    throw new Error("No data to build a chart");

// Буфер, хранящий промежуточные данные
let dataBufPoints = [];

// Для перевода из мс в с
const MS_IN_SECONDS = 1000;

// Размер диапазона дат для промежуточных данных
const BUFFER_DATA_RANGE = 600;
// Минимально число данных для возможности отображения промежуточных данных
const MIN_DATA_TO_SHOW_BUF = 5400;

// Выбранные данные
let targetData = dataPoints;

// Промежуточнае данные или нет
let isBuffer = false;

// Множитель определяющий подробность диаграммы (т.е. определяющий индекс отображаемого массива)
let multiplier = 1;

// Индекс массива
let dataArrayIndex = 10;

// Индекс исходного массива
let original_data_array_index = 10;

// Первая и последняя секунда
// необходимы для расчета исходной области просмотра
let first_tick = dataPoints[targetValue][1][0]['x']*MS_IN_SECONDS;
let last_tick = dataPoints[targetValue][1][dataPoints[targetValue][1].length-1]['x']*MS_IN_SECONDS;

// Исходная область просмотра
let ORIGINAL_VIEWPORT = last_tick - first_tick;

window.onload = function() {

    const myBtns = document.querySelectorAll('[data-value]');
    myBtns[0].classList.add('my-btn_active');

    let ctx = document.getElementById("myChart");

    // Начальные значения по осям
    let x = getArrayAxisX(targetValue, original_data_array_index);
    let y = getArrayAxisY(targetValue, original_data_array_index);

    // Данные для отображения
    let dataToDisplay = {
        // Данные по оси X
        labels: x,
        datasets: [{
            // Данные по оси Y
            data: y,
            // Cтилизация отображения данных
            label: targetValue,
            lineTension: 0,
            fill: false,
            borderColor: '#59779c',
            backgroundColor: 'transparent',
            pointBorderColor: 'orange',
            pointBackgroundColor: 'orange',
            pointRadius: 1,
            pointHoverRadius: 4,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded',
        }]
    };


    // Плагины для chart js
    const chartPlugins = {
        zoom: {
            zoom: {
                enabled: true,
                drag: true,
                mode: 'x',

                onZoomComplete: function({chart}) {
                    let from = chart.options.scales.xAxes[0].ticks.min;
                    let to = chart.options.scales.xAxes[0].ticks.max;
                    // Текущая область просмотра
                    let difference = to - from;

                    // Если текущая область просмотра меньше размера диапазона промежуточных данных
                    // то делаем асинхронный запрос и помещаем в график новые, более подробные данные
                    if (difference/MS_IN_SECONDS <= BUFFER_DATA_RANGE &&
                        ORIGINAL_VIEWPORT/MS_IN_SECONDS >= MIN_DATA_TO_SHOW_BUF) {
                        setAjaxData(from, to);
                    } else {
                        multiplier = ORIGINAL_VIEWPORT/difference;
                        updateChart(chart, multiplier);
                    }
                }
            }
        }
    };

    // Данные об осях (формат, тип и т.п.)
    const chartScales = {
        xAxes: [{
            display: true,
            type: 'time',
            distribution: 'series',
            time: {
                displayFormats: {
                    quarter: 'HH:mm:ss'
                },
                unit: 'quarter',
            },
            ticks: {
                min: first_tick,
                max: last_tick,
            },
            scaleLabel: {
                display: true,
                labelString: 'Time'
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: targetValue
            },
        }]
    };

    // Параметры диаграммы
    const chartOptions = {
        type: 'line',
        data: dataToDisplay,
        options: {

            title: {
                display: true,
                text: "Sensor data statistics" + " " + getFormattedDate(targetData[targetValue][1][1]['x']) + " - " +
                getFormattedDate(targetData[targetValue][1][targetData[targetValue][1].length - 1]['x']),
            },

            animation: {
                duration: 0
            },

            responsive:true,

            maintainAspectRatio: false,

            scales: chartScales,

            plugins: chartPlugins,
        }
    };

    // Инициализируем диаграмму
    let lineChart = new Chart (ctx, chartOptions);

    // Задаем размеры диаграммы
    lineChart.canvas.parentNode.style.height = 'auto';
    lineChart.canvas.parentNode.style.width = '90%';

    // Кнопка сброса увеличения
    let zoomResetBtn = document.querySelector('.zoom-reset');
    zoomResetBtn.onclick = myResetZoom;


    // Функция сброса отображаемых данных и установка новых
    function resetData(newTargetData) {
        targetData = newTargetData;

        first_tick = targetData[targetValue][1][0]['x']*MS_IN_SECONDS;
        last_tick = targetData[targetValue][1][targetData[targetValue][1].length-1]['x']*MS_IN_SECONDS;

        ORIGINAL_VIEWPORT = last_tick - first_tick;

        if (isBuffer)
            original_data_array_index = 1;
        else
            original_data_array_index = 10;

        lineChart.options.scales.xAxes[0].ticks.min = first_tick;
        lineChart.options.scales.xAxes[0].ticks.max = last_tick;

        x = getArrayAxisX(targetValue, original_data_array_index);
        y = getArrayAxisY(targetValue, original_data_array_index);

        setDataAxisX(lineChart, x);
        setDataAxisY(lineChart, y);

        lineChart.update();
    }

    // Функция сброса увеличения
    function myResetZoom() {
        isBuffer = false;
        resetData(dataPoints);

        x = getArrayAxisX(targetValue, original_data_array_index);
        y = getArrayAxisY(targetValue, original_data_array_index);

        setDataAxisX(lineChart, x);
        setDataAxisY(lineChart, y);

        lineChart.options.scales.xAxes[0].ticks.min = first_tick;
        lineChart.options.scales.xAxes[0].ticks.max = last_tick;

        lineChart.resetZoom();
        lineChart.update();
    }

    // Обработка выбора целевого значения для отображения
    // меням стили кнопок, выбираем другое целевое значение, убираем зум, рендерим
    const selectArea = document.querySelector('.select-area');

    selectArea.addEventListener('click', function (e){

        if (!e.target.dataset.value) return;

        targetValue = e.target.dataset.value;

        myBtns.forEach(item => item.classList.remove('my-btn_active'));
        e.target.classList.add('my-btn_active');

        lineChart.options.scales.yAxes[0].scaleLabel.labelString = targetValue;

        updateChart(lineChart, multiplier);

        myResetZoom();
    });

    // Перевод в понятную человеку дату
    function getFormattedDate(unix_timestamp) {

        let date = new Date(unix_timestamp * MS_IN_SECONDS);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let formattedDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;

        return formattedDate;
    }

    // Функция обновления графика
    function updateChart(chart, multiplier) {
        dataArrayIndex = Math.round(original_data_array_index/multiplier);

        if (dataArrayIndex < 1) dataArrayIndex = 1;

        x = getArrayAxisX(targetValue, dataArrayIndex);
        y = getArrayAxisY(targetValue, dataArrayIndex);

        setDataAxisX(chart, x);
        setDataAxisY(chart, y);

        chart.update();
    }

    // Функция получения данных по оси x
    function getArrayAxisX(targetValue, dataArrayIndex) {
        return targetData[targetValue][dataArrayIndex].map(item => item['x']*MS_IN_SECONDS);
    }

    // Функция получения данных по оси y
    function getArrayAxisY(targetValue, dataArrayIndex) {
        return targetData[targetValue][dataArrayIndex].map(item => item['y'].toFixed(6));
    }

    // Устанавливаем новые данные для оси X
    function setDataAxisX (chart, x) {
        chart.config.data.labels = x;
    }

    // Устанавливаем новые данные для оси Y
    function setDataAxisY (chart, y) {
        chart.config.data.datasets[0].data = y;
        chart.config.data.datasets[0].label = targetValue;
    }

    // ajax запрос + устанавливаем новые данные
    function setAjaxData(from, to) {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
            dataBufPoints = JSON.parse(xhr.responseText);
            isBuffer = true;
            resetData(dataBufPoints);
            updateChart(chart, multiplier);
        };

        xhr.open('POST', "indexAJAX.php");
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        let token = "SOME_TOKEN";
        xhr.setRequestHeader("X-CSRF-Token", token);
        xhr.send(`timeRangeFrom=${from/MS_IN_SECONDS}&timeRangeTo=${to/MS_IN_SECONDS}`);
    }
};