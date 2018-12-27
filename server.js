var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);
  usernames = [];
server.listen(process.env.PORT || 3000);
console.log("Server Running");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  console.log('Socket Connected');

  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data)!=-1){
      callback(false);

    }else{
      callback(true);
      socket.username=data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  //Update usernames
  function updateUsernames(){
    io.sockets.emit('usernames', usernames);

  }


  //Send the message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data});
  });


//Disconnect
socket.on('disconnect', function(data){

  if(!socket.username){
    return;
  }
  usernames.splice(usernames.indexOf(socket.username), 1);
  updateUsernames();


});



});
