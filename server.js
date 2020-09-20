const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bad = require('bad-words');
const filter = new bad();



app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index");
});

io.sockets.on('connection', (socket) => {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', (username) => {
        io.emit('is_online', '🔴 <i>' + socket.username + ' lefted the chat..</i>');
    })

    socket.on('chat_message', (message) => {
        let time = new Date();
        /*let player = new Audio('message_recieved.mp3');*/
        if(message != ""){
            io.emit('chat_message',`<i>${time.toLocaleTimeString()}</i><br>` +  '<strong>' + socket.username + '</strong>: ' + filter.clean(message));
        }else{
            io.emit('chat_message', '<strong>Chat Bot</strong>: Message is null')
        }
    });

});

const server = http.listen(8080, () => {
    console.log('listening on *:8080');
});
