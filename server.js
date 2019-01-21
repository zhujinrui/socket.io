const request = require("request");
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 4001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', function(req, res) {
    res.send('.');
});

http.listen(port, function() {
    console.log(`listening on port:${port}`);
});

function sendGuestInfo(socket) {
  request("https://uinames.com/api/?ext && amount=25 &&region=china",
      function(error, response, body) {
          if (!error && response.statusCode === 200) {
              var jsonObject = JSON.parse(body);

              if (socket.readyState === io.OPEN) {

                  // 发，送
                  socket.emit('news',JSON.stringify(jsonObject));

                  //用随机来“装”得更像不定时推送一些
                  setTimeout(function() {
                      sendGuestInfo(socket);
                  }, (Math.random() * 5 + 3) * 1000);
              }
          }
      });
}


io.on('connection', function (socket) {
   sendGuestInfo(socket);
    //发送消息给客户端
    // socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    //广播信息给除当前用户之外的用户
    socket.broadcast.emit('user connected');
    //广播给全体客户端
    io.sockets.emit('all users');
});