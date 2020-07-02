/*
const express = require("express"); done
const socket = require("socket.io"); done
const http = require("http"); done
const app = express(); done
const server = http.createServer(app); done
const io = socket(server); done
const cors = require("cors");

*/

var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const cors = require("cors");

const router = require("./router");
const PORT = process.env.PORT || 5000;

const users = [];
const data = {
  ant1: 0,
  ant2: 0,
  ant3: 0,
  ant4: 0,
};

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
    let disconnectedName;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        disconnectedName = users[i].userName;
        users.splice(i, 1);
      }
    }
    socket.broadcast.emit("Group-Changed", users);
    socket.broadcast.emit("Person Disconnected", disconnectedName);
  });

  socket.on("New User", (name) => {
    users.push({
      id: socket.id,
      userName: name,
    });

    console.log(users);
    socket.broadcast.emit("Person joined", name);
    io.sockets.emit("Group-Changed", users);
  });

  socket.on("newPhase", (message) => {
    socket.broadcast.emit("newPhase", message);
  });

  socket.on("send-chat-message", (message) => {
    let userName;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        userName = users[i];
      }
    }

    socket.broadcast.emit("chat-message", {
      message: message,
      name: userName.userName,
    });
  });



  socket.on("Private-Message", (data, answer) => {
    if (data.id === socket.id) {
      console.log("Tryed to send at yourself");
      answer(true);
      return;
    }
    answer(false);
    let userName;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        userName = users[i];
      }
    }

    const privMessageObj = {
      message: data.message,
      name: userName.userName,
    };
    console.log(privMessageObj.message);
    console.log(privMessageObj.name);
    socket.broadcast.to(data.id).emit("private-message", privMessageObj);
    console.log("Private Message Sucessfully");
  });

  socket.on("NewQuestion", (question) => {
    socket.broadcast.emit("NewQuestion", question);
    data.ant1 = 0;
    data.ant2 = 0;
    data.ant3 = 0;
    data.ant4 = 0;
  });

  //Only Broadcast to Ludwig Englbrecht
  socket.on("question-answered", (value) => {
    if (value == 1) {
      data.ant1++;
    }
    if (value == 2) {
      data.ant2++;
    }
    if (value == 3) {
      data.ant3++;
    }
    if (value == 4) {
      data.ant4++;
    }

    let userName;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        userName = users[i];
      }
    }
    const PersonData = {
      name: userName.userName,
      value: value,
    };

    socket.broadcast.emit("question-answered", PersonData);
  });

  socket.on("showStatistics", function () {
    console.log("data arrvied at server");
    socket.broadcast.emit("showStatistics", data);
  });

  socket.on("DiscussionTime", (value)=>{
    socket.broadcast.emit("DiscussionTime", value);
  })
});

//This Part has to be at the bottom of the Code
app.use(router);
app.use(cors());
server.listen(PORT, () => console.log("Server has started on Port: " + PORT));
