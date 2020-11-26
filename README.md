 # О приложении 
 Приложение читает последние данные из базы данных. 
 На основе этих данных строит соответствующие диаграммы, 
 подробность которых зависит от масштаба увеличения.
 <br> <br>
 Используется база данных **ClickHouse**. 
 
 # Как пользоваться
 - #### Подключение к базе данных
   В файле ***/config/db_params.php*** укажите конфиг вашей базы данных.
   ```php
   return array(
      'host' => 'localhost',
      'port' => '8123',
      'username' => 'default',
      'password' => '',
      'dbname' => 'dbname',
    );
   ```
 - #### Выбор отображаемых данных
    В файле ***/config/data_settings.php*** укажите настройки отображения:
    ```php
   return array(
      'table_name' => 'tablename',
      'count_values_to_display' => 4000,
      'target_values' => ['value_1', 'value_2', 'value_3'],
      'target_value_axisX' => 'timestamp',
   );
    ```
   + В ***'table_name'*** укажите имя таблицы, из которой необходимо брать данные.
   
   + В ***'count_values_to_display'*** укажите максимальное число отображаемых данных на 1 графике
   
   + В ***'target_values'*** укажите массив с названиями колонок (как в таблице), данные из которых вы хотите отобразить на оси Y
   
   + В ***'target_value_axisX'*** укажите название колонки, данные из которой должны отображаться на оси X
   <br><br>

 + #### Отображение данных 
   + Само ототображение данных находится в файле ***/views/chartView.php***
   
   ```html
   <div id="chartContainer">
       <canvas id="myChart" width="600" height="400"></canvas>
   </div>
   ```
   
   + Настройки диаграммы Сhart.js находятся в файле ***/resources/js/myChart.js***
   ```js
   let lineChart = new Chart (ctx, chartOptions);
   ```
 + #### Использование WebSocket
    + В файле ***wsServer.php*** установите свободный порт
    ```php
    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new LiveChart()
            )
        ),
        8665
    );
    ```
   + Запустите сервер ***wsServer.php*** через командную строку
   ```shell script
   php wsServer.php
   ```