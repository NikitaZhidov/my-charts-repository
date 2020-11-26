// ==== Работа js с WebSocket ====

// Подключение ws
let conn = new WebSocket('ws://localhost:8665');
// Переменная хранящая setInterval
let mySetInterval;

// Кнопка запускающая setInterval
let watchLiveBtn = document.querySelector('.watch-live');

let isLive = false;

watchLiveBtn.addEventListener('click', switchWatchLive);

function switchWatchLive() {
    if (isLive) {
        closeWS(mySetInterval);
        watchLiveBtn.classList.remove('active');
    } else {
        connectWS();
        myResetZoom();
        watchLiveBtn.classList.add('active');
    }

    isLive = !isLive;
}
// Функция подключения к ws
function connectWS() {
    conn = new WebSocket('ws://localhost:8665');

    mySetInterval = setInterval(() => {
        conn.send("");
    }, 1000);
}

// Функция отключения ws
function closeWS(interval) {
    conn.close();
    clearInterval(interval);
}

conn.onopen = function(e) {
    console.log("Connection established!");
};

// Обновляем dataPoints
conn.onmessage = function(e) {
    dataPoints = JSON.parse(e.data);
    liveResetData(dataPoints);
};

conn.onerror = (e) => {
    clearInterval(mySetInterval);
}

conn.onclose = (e) => {
    clearInterval(mySetInterval);
}





