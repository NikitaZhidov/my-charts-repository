// Значение для отображения
let targetValue = 'mean';

// Текущий диапазон значений
let difference = 0;

// Множитель определяющий подробность диаграммы (т.е. определяющий индекс отображаемого массива)
let multiplier = 1;

// Индекс массива
let dataArrayIndex = 10;

// Исходная область просмотра
const originalViewport =
    dataPoints[targetValue][1][dataPoints[targetValue][1].length-1]['x'] - dataPoints[targetValue][1][1]['x'];

window.onload = function () {

    targetValue = 'mean';
    dataArrayIndex = 10;
    multiplier = 1;
    difference = 0;


    // Изначально индекс массива равен 10,
    // т.е. (100/10)% значений от максимума

    let chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title:{
            text: "Sensor data statistics" + " " + getFormattedDate(dataPoints[targetValue][1][1]['x']),
        },
        axisY: {
            title: targetValue,
        },
        axisX: {
            title: "Time",
            labelFormatter: function (e) {
                return CanvasJS.formatDate( e.value*1000, "HH:mm:ss");
            },
        },
        data: [{
            type: "spline",
            markerSize: 4,
            yValueFormatString: "###0.#####",
            xValueType: "dateTime",
            dataPoints: dataPoints[targetValue][10]
        }],

        // При изменении диапазона перерисовываем диаграмму
        // multiplier определяет подробность диаграммы
        rangeChanged: function(e) {

            difference = e.axisX[0].viewportMaximum - e.axisX[0].viewportMinimum;
            multiplier = 1;
            if (difference !== 0)
                multiplier = originalViewport/difference;

            dataArrayIndex = Math.round(10/multiplier);

            updateChart(difference, dataArrayIndex, chart);

            console.log('Length of the used array: ' + chart.data[0].dataPoints.length);
        },
});

    chart.render();


    // Обработка выбора целевого значения для отображения
    const selectArea = document.querySelector('.select-area');

    selectArea.addEventListener('click', function (e){

        if (!e.target.dataset.value) return;

        targetValue = e.target.dataset.value;

        updateChart(difference, dataArrayIndex, chart);

    });

    // Функция перерисовки диаграммы с новыми значениями
    function updateChart(difference, dataArrayIndex, chart) {

        // Если difference === 0, значит, мы вернулись в исходное положение
        if (difference === 0) {
            chart.options.data[0].dataPoints = dataPoints[targetValue][10];
        } else if (dataArrayIndex >= 1) {
            chart.options.data[0].dataPoints = dataPoints[targetValue][dataArrayIndex];
        } else {
            chart.options.data[0].dataPoints = dataPoints[targetValue][1];
        }

        chart.options.axisY.title = targetValue;

        chart.render();
    }

    // Перевод в понятную человеку дату
    function getFormattedDate(unix_timestamp) {

        let date = new Date(unix_timestamp * 1000);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let formattedDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;

        return formattedDate;
    }

};
