const io = require('socket.io');

const server = io(process.env.PORT || 3000);

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

    socket.on('updatePosition', function(data){
        console.log(data);
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        
        socket.broadcast.emit('updatePosition', player);
    });

    socket.on('disconnect', function(){
        console.log('Tratando desconexão');
        delete players[pID];
        delete socket[pID];
        socket.broadcast.emit('disconnected', player);
    });

   
});