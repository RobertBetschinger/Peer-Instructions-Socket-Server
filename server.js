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
const data ={
  ant1: 0,
  ant2: 0,
  ant3: 0,
  ant4: 0
}

io.on('connection', function(socket){
          console.log('a user connected');
        	socket.on('disconnect', function(){
                 console.log('user disconnected');
                 socket.broadcast.emit('Person Disconnected',users[socket.id])
                 delete users[socket.id]
          });
           


            socket.on('newPhase', message =>{
              socket.broadcast.emit('newPhase', message)
            })

            socket.on('send-chat-message', message => {
              socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
            })

            socket.on('New User', name =>{
              users[socket.id] = name
              socket.broadcast.emit('Person joined', name)
            })

            socket.on('NewQuestion',question =>{
              socket.broadcast.emit('NewQuestion', question)
              data.ant1=0;
              data.ant2=0;
              data.ant3=0;
              data.ant4=0;
            })

            //Only Broadcast to Ludwig Englbrecht
            socket.on('question-answered',value =>{
              if(value ==1){
                data.ant1++
              }
            if(value ==2){
              data.ant2++
            }
            if(value ==3){
              data.ant3++
            }
            if(value ==4){
              data.ant4++
            }
            const PersonData ={
              name:users[socket.id],
              value:value
            }
           
              socket.broadcast.emit('question-answered',PersonData)
            })

            socket.on('showStatistics', function(){
              console.log("data arrvied at server");
              socket.broadcast.emit('showStatistics',data)
            })
});

//This Part has to be at the bottom of the Code
app.use(router);
app.use(cors())
server.listen(PORT, () => console.log('Server has started on Port: ' +  PORT));

