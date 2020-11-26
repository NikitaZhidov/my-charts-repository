<?php

//  Корневой каталог
define('ROOT', dirname(__FILE__));

//    Автозагрузка классов
require_once ROOT . '/vendor/autoload.php';
require_once ROOT . '/components/Autoload.php';

//    Отображение ошибок
ini_set('display_errors', 1);


// Подключение Ratchet
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;


class LiveChart implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    // При отправки сообщения с клиента, сделать запрос из бд и отправить назад
    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        // Получение данных из бд
        $arraySend = array();
        $arraySend = Chart::getLastData();
        foreach ($this->clients as $client) {
            $client->send(json_encode($arraySend));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}

// Запуск сервера

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new LiveChart()
        )
    ),
    8665
);

$server->run();