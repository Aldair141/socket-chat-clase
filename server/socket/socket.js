const { io } = require('../server');
const { Usuario } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuario = new Usuario();

io.on('connection', (client) => {
    //Cuando escuche el evento 'entrarChat', trae la lista de usuarios conectados a la sala.
    client.on('entrarChat', (infoUsuario, callback) => {
        if (!infoUsuario.nombre || !infoUsuario.sala) {
            callback({
                ok: false,
                message: 'El nombre/sala es obligatorio'
            });
        } else {
            client.join(infoUsuario.sala);

            usuario.agregarPersonas(client.id, infoUsuario.nombre, infoUsuario.sala);
            client.broadcast.to(infoUsuario.sala).emit('listaPersonas', usuario.obtenerPersonasxSala(infoUsuario.sala));
            client.broadcast.to(infoUsuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${infoUsuario.nombre} se unió al chat.`));
            callback({
                ok: true,
                personas: usuario.obtenerPersonasxSala(infoUsuario.sala)
            });
        }
    });

    client.on('disconnect', () => {
        let personaBorrada = usuario.eliminarPersona(client.id);

        //Avisar a todos los usuarios que alguien salió de la sala de chat
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat.`));

        //Emitir a todos los usuarios la lista actualizada de usuarios
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuario.obtenerPersonasxSala(personaBorrada.sala));
    });

    //Escuchar el mensaje que algún puto usuario mande
    client.on('crearMensaje', (dataMensaje, callback) => {
        let persona = usuario.obtenerPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, dataMensaje.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback({
            ok: true,
            mensaje: mensaje
        });
    });

    //El servidor escucha mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuario.obtenerPersona(client.id);

        //Mandas un parámetro adicional para especificar a qué sesión en específico mandar un mensaje
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});