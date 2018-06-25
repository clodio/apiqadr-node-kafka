var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message');
    
var nb_messages_to_send = 10;
var nb_messages_sended = 0;
var topic = 'topic4';

client.on('error', function (err) {
    console.error('error');
    console.error(err);
});

producer.on('ready', function () {

    sendMessage();
    setInterval(sendMessages, 1000);

});

producer.on('error', function (err) {
    console.error('error');
    console.error(err);
});

process.on('uncaughtException', function (err) {
    console.error('uncaughtException');
    console.error(err);
}); 

function sendMessages () {
    var date = new Date().toString();
    var message = {date:date};
    producer.send([
        {topic: topic, messages: JSON.stringify(message)}
    ], function (err, data) {
        if (err) console.log(err);
        else console.log('send %d messages', ++nb_messages_sended);
        if (nb_messages_sended === nb_messages_to_send) {
            process.exit();
        }
    });
};

function sendMessage () {
    var date = new Date().toString();
    var message = {date:date};
    var payloads = [
        { topic: topic, messages: JSON.stringify(message), partition: 0 },
        { topic: 'topic2', messages: ['hello', 'world', km] }
    ];
    producer.send(payloads, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
};