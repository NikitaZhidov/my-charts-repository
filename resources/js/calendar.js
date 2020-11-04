
// Переменные для отслеживания крайнего часа в диапазоне
// чтобы корректно отображать минуты
let isBorderHour = true;
let selectedHourNum = 1;
let selectedMinute = 0;

// Объект с минимально возможной датой для отображения данных
const minDate = {
    day: new Date(timeRange['minDate']*1000).getDate(),
    month: new Date(timeRange['minDate']*1000).getMonth(),
    year: new Date(timeRange['minDate']*1000).getFullYear(),
    hour: new Date(timeRange['minDate']*1000).getHours(),
    minutes: new Date(timeRange['minDate']*1000).getMinutes(),
};

// Объект с максимально возможной датой для отображения данных
const maxDate = {
    day: new Date(timeRange['maxDate']*1000).getDate(),
    month: new Date(timeRange['maxDate']*1000).getMonth(),
    year: new Date(timeRange['maxDate']*1000).getFullYear(),
    hour: new Date(timeRange['maxDate']*1000).getHours(),
    minutes: new Date(timeRange['maxDate']*1000).getMinutes(),
};

const date = new Date(minDate.year, minDate.month, minDate.day);

// Текущая выбранная дата
let selectedYear = minDate.year;
let selectedMonth = minDate.month;
let selectedDay = minDate.day;

// Отрисовка календаря
const renderCalendar = () => {
    const monthDays = document.querySelector(".cal__days");

    // Данные для корректного отображения и расположения чисел месяца
    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();

    const firstDayIndex = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDay();

    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex;

    const months = [
        "Январь",
        "Февравль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ];

    // Текущее выбранное время
    const selectHours = document.getElementById("selected-hour");
    const selectMinutes = document.getElementById("selected-minutes");

    let minHours = 0;
    let maxHours = 23;

    let minMinutes = 0;
    let maxMinutes = 59;

    if (selectedDay == minDate.day && selectedMonth == minDate.month && selectedYear == minDate.year) {
        minHours = minDate.hour;
        if (isBorderHour)
            minMinutes = minDate.minutes;
    }
    if (selectedDay == maxDate.day && selectedMonth == maxDate.month && selectedYear == maxDate.year) {
        maxHours = maxDate.hour;
        if (isBorderHour)
            maxMinutes = maxDate.minutes;
    }

    // Отображение текущей даты в календаре
    document.querySelector(".cal__date h2").innerHTML = date.getFullYear();

    document.querySelector(".cal__date h1").innerHTML = months[date.getMonth()];

    document.querySelector(".cal__date p").innerHTML = new Date(
        selectedYear,
        selectedMonth,
        selectedDay
    ).toLocaleDateString();

    // Отображение всех дней
    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="cal__prev-date">${prevLastDay - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        if (
            i == selectedDay &&
            selectedMonth == date.getMonth() &&
            selectedYear == date.getFullYear()
        ) {
            days += `<div class="active">${i}</div>`;
            continue;
        }

        if (
            (minDate.month == maxDate.month) &&
            (minDate.month == date.getMonth()) &&
            (minDate.year == maxDate.year) &&
            (minDate.year == date.getFullYear())
        ) {
            if (i >= minDate.day && i <= maxDate.day){
                days += `<div>${i}</div>`;
            } else {
                days += `<div class="disabled">${i}</div>`;
            }
            continue;
        }

        if ((minDate.month != maxDate.month) &&
            (minDate.year == date.getFullYear())
            ) {
            if ((i >= minDate.day) &&
                (minDate.month == date.getMonth())
            ){
                days += `<div>${i}</div>`;
                continue;
            }

            if (
                (i <= maxDate.day) &&
                (maxDate.month == date.getMonth())
            ){
                days += `<div>${i}</div>`;
                continue;
            }

            if (
                minDate.month < date.getMonth() &&
                maxDate.month > date.getMonth()
            ) {
                days += `<div>${i}</div>`;
                continue;
            }
        }

        if (minDate.year != maxDate.year) {
            if (
                (i >= minDate.day && minDate.month == date.getMonth()) ||
                (date.getMonth() > minDate.month && date.getFullYear() == minDate.year)
            ) {
                days += `<div>${i}</div>`;
                continue;
            }

            if (
                (i <= maxDate.day && maxDate.month == date.getMonth()) ||
                (date.getMonth() < maxDate.month && date.getFullYear() == maxDate.year)
            ) {
                days += `<div>${i}</div>`;
                continue;
            }

        }

        days += `<div class="disabled">${i}</div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="cal__next-date">${j}</div>`;
    }

    monthDays.innerHTML = days;

    // Отображение времени
    let hours = "",
        minutes = "";

    for (let i = minHours; i <= maxHours; i++) {
        if (selectedHourNum == i) {
            hours += `<option selected>${i < 10 ? '0' + i : i}</option>`;
            continue;
        }
        hours += `<option>${i < 10 ? '0' + i : i}</option>`;
    }

    for (let i = minMinutes; i <= maxMinutes; i++) {
        if (selectedMinute == i) {
            minutes += `<option selected>${i < 10 ? '0' + i : i}</option>`;
            continue;
        }
        minutes += `<option>${i < 10 ? '0' + i : i}</option>`;
    }

    selectHours.innerHTML = hours;
    selectMinutes.innerHTML = minutes;

    // При нажатии на доступную дату - выбираем ее
    document.querySelectorAll(".cal__days div").forEach((day) => {
        day.addEventListener("click", (e) => {
            if (e.target.classList.length > 0) return;
            selectedMonth = date.getMonth();
            selectedDay = e.target.innerHTML;
            selectedYear = date.getFullYear();

            setIsBorderHour(selectedHourNum);

            renderCalendar();
        });
    });

    // При изменении часа - отрисовываем календарь для корректного отображения минут
    // и изменяем выбранный час
    document.getElementById('selected-hour').addEventListener("change", (e) => {
        selectedHourNum = e.target.value;

        setIsBorderHour(selectedHourNum);

        renderCalendar();
    });

    // При изменении минут изменяем выбранную минуту
    document.getElementById('selected-minutes').addEventListener("change", (e) => {
       selectedMinute = e.target.value;
    });

    // Функция, которая проверяет: крайний ли выбранный час
    function setIsBorderHour(selectedHourNum) {
        if (
            (selectedHourNum == minDate.hour && selectedDay == minDate.day) ||
            (selectedHourNum == maxDate.hour && selectedDay == maxDate.day)
        ){
            isBorderHour = true;
        } else {
            isBorderHour = false;
        }
    }

};

// Переключение месяцев
document.querySelector(".cal-prev").addEventListener("click", (e) => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".cal-next").addEventListener("click", (e) => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();


// Работа с модальным окном (календарем)

let calModal = document.querySelector('.cal-modal');

// Переменная, контролирующая какую границу в диапазоне дат выбираем ("от" или "до")
let currentTimeLimitElement = 'from';

// При клике на кнопку выбора даты - открываем модальное окно с календарем
document.querySelectorAll('.select-date-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {

        calModal.classList.remove('hide');
        document.body.classList.add('lock');

        // Для удобства, в календаре сразу выбирается предыдущая дата
        let arrayDate = e.target.innerHTML.split('.'),
            currentDay = arrayDate[0].trim(),
            currentMonth = arrayDate[1].trim(),
            currentYear = arrayDate[2].split(' ')[0].trim(),
            currentHour = arrayDate[2].split(' ')[1].trim().split(':')[0],
            currentMinute = arrayDate[2].split(' ')[1].trim().split(':')[1];

        selectedDay = currentDay;
        selectedMonth = currentMonth - 1;
        selectedYear = currentYear;
        selectedHourNum = currentHour;
        selectedMinute = currentMinute;

        renderCalendar();
        // Отмечаем, какую дату выбираем ("от" или "до")
        currentTimeLimitElement = e.target.dataset.timebtn;
    })
});

// При клике на темную область в модальном окне - закрыть окно
calModal.addEventListener('click', (e) => {
   if (!e.target.dataset.hide) return;
   calModal.classList.add('hide');
});

// При нажатии на кнопку прнять - фиксируем дату в виде надписи на кнопке
document.querySelector('.cal__accept-btn').addEventListener('click', (e) => {
    calModal.classList.add('hide');
    document.body.classList.remove('lock');

    let hours = document.getElementById('selected-hour').value;
    let minutes = document.getElementById('selected-minutes').value;

    let dateToSend = new Date(selectedYear, selectedMonth, selectedDay, hours, minutes).getTime()/1000;

    // Заносим данные в "невидимую" форму для отправки
    if (currentTimeLimitElement == 'from') {
        dateToSend -= 60;
        document.getElementById('timeRangeFrom').value = dateToSend;
    } else {
        dateToSend += 60;
        document.getElementById('timeRangeTo').value = dateToSend;
    }

    let correctFormat = "";
    correctFormat += (selectedDay < 10 && selectedDay.split('').length < 2) ? '0' + selectedDay : selectedDay;
    correctFormat += ".";
    correctFormat += (selectedMonth + 1) < 10 ? '0' + (selectedMonth + 1) : (selectedMonth + 1);
    correctFormat += "." + selectedYear + " ";
    correctFormat += hours + ":";
    correctFormat += minutes;

    document.getElementById(currentTimeLimitElement).innerHTML = correctFormat;
});
