const server = require('socket.io')(process.env.PORT || 52300);


//Classes
const Player = require('./Classes/Player');

var players = []; //vou armanzenar os jogadores
var sockets = []; //vou armanzenar os sockets de cada player

console.log('Server ok');


server.on('connection', function(socket){
    console.log('conection sucessfull');

    //crio
    const player = new Player();
    const pID = player.id;

    players[pID] = player;
    sockets[pID] = socket;  

    socket.emit('register', {id: pID});

    socket.emit('spawn', player); //Indica ao meu client
    socket.broadcast.emit('spawn', player); //Indica a todos os outros clients;

    //Atualizar todos os players;

    for(var aPlayer in players){
        if(aPlayer != pID){
            socket.emit('spawn', players[aPlayer]);
        }
    }

    socket.on('updatePos', function(data){

        player.position.x = data.position.x/10000;
        player.position.y = data.position.y/10000;
        console.log(player);
        socket.broadcast.emit("updatePosition", player);
    });

    socket.on('disconnect', function(){
        console.log('Tratando desconexão');
        delete players[pID];
        delete socket[pID];
        socket.broadcast.emit('disconnected', player);
    });

   
});