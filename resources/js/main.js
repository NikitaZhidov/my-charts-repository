
// Закрытие окна выбора диапазона
let selectTimeRangeBtn = document.querySelector('.timerange-btn');
let closeTimeRangeAreaBtn = document.querySelector('.timerange-close');

// Подтверждение выбора диапазона дат
let timeRangeAcceptBtn = document.querySelector('.timerange-input-btn');
timeRangeAcceptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Данные из "невидимой формы"
    let from = document.getElementById('timeRangeFrom').value;
    let to = document.getElementById('timeRangeTo').value;

    // if (isLive) switchWatchLive();
    // Асинхронно подгружаем данные
    setAjaxData(from*MS_IN_SECONDS, to*MS_IN_SECONDS); // функция из myChart.js
    myResetZoom();
});

selectTimeRangeBtn.addEventListener('click', (e) => {
   document.querySelector('.timerange-area').classList.toggle('hide');
});

closeTimeRangeAreaBtn.addEventListener('click', (e) => {
    document.querySelector('.timerange-area').classList.toggle('hide');
});



