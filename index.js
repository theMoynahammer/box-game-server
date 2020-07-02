const Koa = require('koa');
const send = require('koa-send');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;

// app.use(async ctx => {
//   await send(ctx, './index.html');
// });
router.get('/', (ctx, next) => {
  ctx.body = "Hello, you found me!"
});

router.get('/multiplayer1', (ctx, next) => {
  ctx.body = JSON.stringify(currentState1)
});

router.get('/multiplayer2', (ctx, next) => {
  ctx.body = JSON.stringify(currentState2)
});

router.get('/multiplayer3', (ctx, next) => {
  ctx.body = JSON.stringify(currentState3)
});

// router.get('/restart-socket', (ctx, next) => {
//   socket.close();
//   socket.open();
// });

// router.get('/close-socket', (ctx, next) => {
//   socket.close();
// });

// router.get('/open-socket', (ctx, next) => {
//   socket.open();
// });



// const socketWrapper = () =>{
let currentState1 = null;
let currentState2 = null;
let currentState3 = null;

io.on('connection', (socket) => {
  // setTimeout(() => socket.disconnect(true), 5000);

  console.log('a user connected');
  console.log(`current client count: ${io.engine.clientsCount}`)

  socket.on('joining game 1', () => {
    console.log('getting "joining game" event for game 1')
    io.emit('joiningGameState1', currentState1)
  })
  socket.on('joining game 2', () => {
    console.log('getting "joining game" event for game 2')
    io.emit('joiningGameState2', currentState2)
  })
  socket.on('joining game 3', () => {
    console.log('getting "joining game" event for game 3')
    io.emit('joiningGameState3', currentState3)
  })

  socket.on('newState1', (newState1) => {
    console.log('"newState1" event received');
    currentState1 = { ...newState1 };
    io.emit('newState1', newState1);
  });

  socket.on('newState2', (newState2) => {
    console.log('"newState2" event received');
    currentState2 = { ...newState2 };
    io.emit('newState2', newState2);
  });
  socket.on('newState3', (newState3) => {
    console.log('"newState3" event received');
    currentState3 = { ...newState3 };
    io.emit('newState3', newState3);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    console.log(`current client count: ${io.engine.clientsCount}`)
    // if (io.engine.clientsCount === 0) {
    //   console.log('no clients, game reset')
    //   currentState = null;
    // }
  });
});
// }

// socketWrapper();
// let currentState = null;

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   console.log(`current client count: ${io.engine.clientsCount}`)
//   socket.on('joining game', ()=>{
//     // console.log('right here', currentState)
//     console.log('getting "joining game" event')
//     io.emit('joiningGameState', currentState)
//   })
//   socket.on('newState', (newState) => {
//     // console.log('newState: ' + JSON.stringify(newState));
//     console.log('"newState" event received');
//     currentState = {...newState};
//     io.emit('newState', newState);
//     // socket.on('chat message', (msg) => {
//     //   console.log('message: ' + msg);
//     //   io.emit('chat message', msg);
//   });
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//     console.log(`current client count: ${io.engine.clientsCount}`)
//     if (io.engine.clientsCount === 0){
//       console.log('no clients, game reset')
//       currentState = null;
//     }
//   });
// });

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log(`listening on port ${port}`)
server.listen(port);
