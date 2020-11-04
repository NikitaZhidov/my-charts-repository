
// Закрытие окна выбора диапазона
let selectTimeRangeBtn = document.querySelector('.timerange-btn');
let closeTimeRangeAreaBtn = document.querySelector('.timerange-close');

selectTimeRangeBtn.addEventListener('click', (e) => {
   document.querySelector('.timerange-area').classList.toggle('hide');
});

closeTimeRangeAreaBtn.addEventListener('click', (e) => {
    document.querySelector('.timerange-area').classList.toggle('hide');
});

