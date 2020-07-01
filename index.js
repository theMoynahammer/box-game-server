const Koa = require('koa');
const send = require('koa-send');
const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;

app.use(async ctx => {
  await send(ctx, './index.html');
});

let currentState = null;

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(`current client count: ${io.engine.clientsCount}`)
  socket.on('joining game', ()=>{
    // console.log('right here', currentState)
    console.log('getting "joining game" event')
    io.emit('joiningGameState', currentState)
  })
  socket.on('newState', (newState) => {
    // console.log('newState: ' + JSON.stringify(newState));
    console.log('"newState" event received');
    currentState = {...newState};
    io.emit('newState', newState);
    // socket.on('chat message', (msg) => {
    //   console.log('message: ' + msg);
    //   io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    console.log(`current client count: ${io.engine.clientsCount}`)
    if (io.engine.clientsCount === 0){
      console.log('no clients, game reset')
      currentState = null;
    }
  });
});

console.log(`listening on port ${port}`)
server.listen(port);
