
# Code pour envoyer des messages kafka

## Lancer zookeeper

    zkServer.cmd

## Lancer kafka
    
    cd /c/node/kafka_2.11-1.1.0
    ./bin/windows/kafka-server-start.bat ./config/server.properties


## Créer topic

    cd /c/node/kafka_2.11-1.1.0/bin/windows
    ./kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic topic1

    cd /c/node/kafka_2.11-1.1.0/bin/windows
    ./kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 3 --topic topic3

    
## Envoyer message

    npm start
