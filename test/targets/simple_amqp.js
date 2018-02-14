const AMQP = require('amqplib');


var open = AMQP.connect('amqp://localhost');
const { exec } = require('child_process');


const AMQP_PORT = 5672;
const ls = spawn('docker run', ['-d',
                                '-p', `${AMQP_PORT}:${AMQP_PORT}`,
                                '--hostname', 'my-rabbit',
                                '--name', 'rabbit',
                                'rabbitmq:3']);

const DOCKER_RUN_COMMAND = `docker run -d -p ${AMQP_PORT}:${AMQP_PORT} --hostname my-rabbit --name rabbit rabbitmq:3`

exec(DOCKER_RUN_COMMAND, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

const QUEUE_NAME = 'someQueue';

createConsumer();



// // Publisher
// open.then(function(conn) {
//   return conn.createChannel();
// }).then(function(ch) {
//   return ch.assertQueue(q).then(function(ok) {
//     return ch.sendToQueue(q, new Buffer('something to do'));
//   });
// }).catch(console.warn);

module.exports = createConsumer;

// Consumer
function createConsumer() {
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    return ch.assertQueue(QUEUE_NAME).then(function (ok) {
      return ch.consume(QUEUE_NAME, function (msg) {
        if (msg !== null) {
          console.log("received message");
          console.log(JSON.stringify(msg.content.toString()));
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
}




// let open = AMQP.connect("amqp://localhost:5672");
// let connection = open().then();
// let channel = connection.createChannel();
// let queue = "someQueue";
// await channel.assertQueue(queue);

// const myConsumer = (msg) => {
//   if (msg !== null) {
//     console.log('consuming message %s', JSON.stringify(msg.content.toString()));
//   }
// };

// const consume = () => {
//   channel.consume(queue, myConsumer, { noAck: true });
//   setTimeout(consume, 1000);
// }

// consume();
