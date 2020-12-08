<?php

Class Pusher extends BasePusher
{
    static public function sendDataToServer($data)
    {
//      !temporary
        $data = self::addRandomValues($data);
//      !temporary
        $context = new ZMQContext();
        $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
        $socket->connect("tcp://localhost:8655");
        $socket->send(json_encode($data));
    }

//    !temporary function
    static private function addRandomValues($currentData)
    {
        array_shift($currentData['maxDev'][10]);
        array_shift($currentData['stdDev'][10]);
        array_shift($currentData['mean'][10]);

        $newLastSecond = (intval(end($currentData['maxDev'][10])['x']) + 11);
        $value = ['x' =>  $newLastSecond, 'y' => rand(15150000, 16500000)/1000000 ];
        array_push($currentData['maxDev'][10], $value);

        $value = ['x' =>  $newLastSecond, 'y' => rand(29715, 32224)/1000000 ];
        array_push($currentData['stdDev'][10], $value);

        $value = ['x' =>  $newLastSecond, 'y' => rand(61862105, 61863207)/10000 ];
        array_push($currentData['mean'][10], $value);

        return $currentData;
    }
//    !temporary function
}

