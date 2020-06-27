const Koa = require('koa');
const send = require('koa-send');
const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;

app.use(async ctx => {
  await send(ctx, './index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
});

console.log(`listening on port ${port}`)
server.listen(port);