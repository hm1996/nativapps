const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let valoresHorario = {
    values: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    message: '{VALUE} no es un valor de horario valido'
};

let cursoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    horario: {
        type: String,
        // Solo un curso en ese horario
        unique: true,
        enum: valoresHorario,
        required: [true, 'El horario es obligatorio']
    },
    fechaInicio: {
        type: String,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    fechaFin: {
        type: String,
        required: [true, 'La fecha de finalizacion es obligatoria']
    },
    numeroEstudiantes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Curso', cursoSchema);