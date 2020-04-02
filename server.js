const express = require('express')
const socket = require('socket.io')
const http = require('http')
const app = express();
const server = http.createServer(app);
const io = socket(server);
const cors = require('cors');

const router = require('./router');
const PORT = process.env.PORT || 5000

const users ={}

io.on('connection', function(socket){
          console.log('a user connected');
        	socket.on('disconnect', function(){
                 console.log('user disconnected');
                 socket.broadcast.emit('Person Disconnected',users[socket.id])
                 delete users[socket.id]
                });
           

            socket.on('send-chat-message', message => {
              socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
            })

            socket.on('New User', name =>{
              users[socket.id] = name
              socket.broadcast.emit('Person joined', name)
            })
});

//This Part has to be at the bottom of the Code
app.use(router);
app.use(cors())
server.listen(PORT, () => console.log('Server has started on Port: ' +  PORT));

