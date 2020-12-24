var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios.');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado...');

    socket.emit('entrarChat', usuario, function(resp) {
        //Trayendo la lista de usuarios conectados a la sala de chat
        //console.log(resp);
        renderizarUsuarios(resp.personas);
    });
});

// socket.on('disconnect', function() {
//     console.log('Desconectado del servidor.');
// });

socket.on('crearMensaje', function(response) {
    renderizarMensajes(response, false);
    scrollBottom();
    document.getElementById('audio').play();
});

//Enviando mensajes privados
socket.on('mensajePrivado', function(_mensaje) {
    console.log("Mensaje privado: ", _mensaje);
});

//Cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(response) {
    renderizarUsuarios(response);
});