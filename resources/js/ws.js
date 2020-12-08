let conn = new ab.Session(
    'ws://localhost:8010',
    function() {
        conn.subscribe('chartData', function(topic, data) {
            // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
            console.log('New article published to category "' + topic + '" : ' + data.title);
            let parsedData = JSON.parse(data.data);
            dataPoints = parsedData;
            liveResetData(parsedData);
        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
);

//!temporary
function liveWatcherCreate() {

    let watchLiveInterval;
    let isLive = false;

    function toggleLiveChart() {
        if (isLive) {
            stopLiveChart();
        } else {
            multiplier = 1;
            startLiveChart();
        }
        isLive = !isLive;
    }

    function startLiveChart() {
        watchLiveInterval = setInterval(() => {
            sendAjaxRequest();
        }, 1000)
    }

    function stopLiveChart() {
        clearInterval(watchLiveInterval);
    }

    function sendAjaxRequest() {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
        };

        xhr.open('POST', "index.php");
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        let token = "SOME_TOKEN";
        xhr.setRequestHeader("X-CSRF-Token", token);
        let currentData = JSON.stringify(dataPoints);
        xhr.send(`currentData=${currentData}&isTempAjax=true`);
    }

    return {
        startLiveChart,
        stopLiveChart,
        toggleLiveChart,
    }
}

const watcher = liveWatcherCreate();

let watchLiveBtn = document.querySelector('.watch-live');

watchLiveBtn.addEventListener('click', () => {
    watcher.toggleLiveChart();
    watchLiveBtn.classList.toggle('active');
});
//!temporary



