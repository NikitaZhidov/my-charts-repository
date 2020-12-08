<?php

use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;

class BasePusher implements WampServerInterface {

    protected $subscribedTopics = array();

    public function onSubscribe(ConnectionInterface $conn, $topic) {
        $this->subscribedTopics[$topic->getId()] = $topic;
    }

    /**
     * @param string JSON'ified string we'll receive from ZeroMQ
     */
    public function sendChartData($entryData) {
        $dataToSend = ['title' => 'chartData', 'data' => $entryData];

        if (isset($this->subscribedTopics['chartData'])) {
            $topic = $this->subscribedTopics['chartData'];
            $topic->broadcast($dataToSend);
        }
    }

    public function onUnSubscribe(ConnectionInterface $conn, $topic) {
    }
    public function onOpen(ConnectionInterface $conn) {
        echo sprintf('New connection (' . $conn->resourceId . ')!'."\n");
    }
    public function onClose(ConnectionInterface $conn) {
        echo sprintf('Connection (' . $conn->resourceId . ') has disconnected!'."\n");
    }
    public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }
    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo sprintf($e->getMessage()."\n");
        $conn->close();
    }
}