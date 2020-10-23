
if (dataPoints.length < 1)
    throw new Error("No data to build a chart");


// Множитель определяющий подробность диаграммы (т.е. определяющий индекс отображаемого массива)
let multiplier = 1;

// Индекс массива
let dataArrayIndex = 10;

// Индекс исходного массива
const ORIGINAL_DATA_ARRAY_INDEX = 10;

// Первая и последняя секунда
// необходимы для расчета исходной области просмотра
const FIRST_TICK = dataPoints[targetValue][1][0]['x']*1000;
const LAST_TICK = dataPoints[targetValue][1][dataPoints[targetValue][1].length-1]['x']*1000;

// Исходная область просмотра
const ORIGINAL_VIEWPORT = LAST_TICK - FIRST_TICK;

window.onload = function() {

    const myBtns = document.querySelectorAll('[data-value]');
    myBtns[0].classList.add('my-btn_active');

    let ctx = document.getElementById("myChart");

    // Начальные значения по осям
    let x = getArrayAxisX(targetValue, ORIGINAL_DATA_ARRAY_INDEX);
    let y = getArrayAxisY(targetValue, ORIGINAL_DATA_ARRAY_INDEX);

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

                    // Текущая область просмотра
                    difference = chart.options.scales.xAxes[0].ticks.max -
                        chart.options.scales.xAxes[0].ticks.min;

                    multiplier = 1;

                    multiplier = ORIGINAL_VIEWPORT/difference;

                    updateChart(chart, multiplier);

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
                min: FIRST_TICK,
                max: LAST_TICK,
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
                text: "Sensor data statistics" + " " + getFormattedDate(dataPoints[targetValue][1][1]['x']),
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

    // Функция сброса увеличения
    function myResetZoom() {
        x = getArrayAxisX(targetValue, ORIGINAL_DATA_ARRAY_INDEX);
        y = getArrayAxisY(targetValue, ORIGINAL_DATA_ARRAY_INDEX);

        setDataAxisX(lineChart, x);
        setDataAxisY(lineChart, y);

        lineChart.options.scales.xAxes[0].ticks.min = FIRST_TICK;
        lineChart.options.scales.xAxes[0].ticks.max = LAST_TICK;

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

        let date = new Date(unix_timestamp * 1000);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let formattedDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;

        return formattedDate;
    }

    // Функция обновления графика
    function updateChart(chart, multiplier) {
        dataArrayIndex = Math.round(ORIGINAL_DATA_ARRAY_INDEX/multiplier);

        if (dataArrayIndex < 1) dataArrayIndex = 1;

        x = getArrayAxisX(targetValue, dataArrayIndex);
        y = getArrayAxisY(targetValue, dataArrayIndex);



        setDataAxisX(chart, x);
        setDataAxisY(chart, y);

        chart.update();
    }

    // Функция получения данных по оси x
    function getArrayAxisX(targetValue, dataArrayIndex) {
        return dataPoints[targetValue][dataArrayIndex].map(item => item['x']*1000);
    }

    // Функция получения данных по оси y
    function getArrayAxisY(targetValue, dataArrayIndex) {
        return dataPoints[targetValue][dataArrayIndex].map(item => item['y'].toFixed(6));
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
};