class Usuario {
    constructor() {
        this.personas = [];
    }

    agregarPersonas(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };

        this.personas.push(persona);

        return this.personas;
    }

    obtenerPersona(id) {
        let persona = this.personas.filter(_persona => {
            return _persona.id === id
        })[0];

        return persona;
    }

    obtenerPersonas() {
        return this.personas;
    }

    obtenerPersonasxSala(sala) {
        let personasEnSala = this.personas.filter(_persona => {
            return _persona.sala === sala;
        });

        return personasEnSala;
    }

    eliminarPersona(id) {
        let personaBorrada = this.obtenerPersona(id);

        this.personas = this.personas.filter(_persona => {
            return _persona.id !== id;
        });

        return personaBorrada;
    }
}

module.exports = {
    Usuario
}