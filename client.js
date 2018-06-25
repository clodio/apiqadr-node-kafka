var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    client = new kafka.Client('localhost:2181');
    
var kafka_topic = 'topic4';
var kafka_partition = 0;

var topics = [ { topic: kafka_topic, partition: kafka_partition }];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

var consumer = new Consumer(client, topics, options);
//consumer.setOffset(topic, kafka_partition, 0);
var offset = new Offset(client);

consumer.on('error', function (err) {
    console.error('error consumer');
    console.error(err);
});

function analyseMessage (message, callback) {
    var data = JSON.parse(message.value);
    console.log(data);
    //console.log(JSON.parse(message.value));
    consumer.commit(function(err, data) {
        console.log("comitting data");
        console.log(data);
        console.log(err);
        consumer.resumeTopics([{ topic: kafka_topic, partition: kafka_partition }]);
    });
    return callback;
};

function sendMessage (message, callback) {
    var date = new Date().toString();
    var message = {date:date};
    var payloads = [
        { topic: kafka_topic, messages: JSON.stringify(message), partition: 0 }
    ];
    return callback;
};

consumer.on('message', function (message) {
    console.log('message');
    consumer.pauseTopics([{ topic: kafka_topic, partition: kafka_partition }]);
    setInterval(sendMessage(message), 5000);
    
});
  
/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
    console.log("offsetOutOfRange");
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        if (err) {
            
        return console.error(err);
        }
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
});


 
// producer.on('ready', function () {

//     sendMessage();
//     setInterval(sendMessages, 1000);

// });

// producer.on('error', function (err) {
//     console.error('error');
//     console.error(err);
// });

// process.on('uncaughtException', function (err) {
//     console.error('uncaughtException');
//     console.error(err);
// }); 

// function sendMessages () {
//     console.log('sendMessages');
//     var date = new Date().toString();
//     var message = {date:date};
//     producer.send([
//         {topic: topic, messages: JSON.stringify(message)}
//     ], function (err, data) {
//         if (err) console.log(err);
//         else console.log('send %d messages', ++nb_messages_sended);
//         if (nb_messages_sended === nb_messages_to_send) {
//             process.exit();
//         }
//     });
// };

// function sendMessage () {
//     console.log('sendMessage');
//     var date = new Date().toString();
//     var message = {date:date};
//     var payloads = [
//         { topic: topic, messages: JSON.stringify(message), partition: 0 },
//         { topic: 'topic2', messages: ['hello', 'world', km] }
//     ];
//     producer.send(payloads, function (err, data) {
//         if (err) console.log(err);
//         else console.log(data);
//     });
// };