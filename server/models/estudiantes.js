const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let estudianteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    edad: {
        type: Number,
        required: false
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    cursos: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);