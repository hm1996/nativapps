require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/cursos'));
app.use(require('./routes/estudiantes'));

const puerto = process.env.PORT;
const servidorDB = process.env.DB;

mongoose.connect(servidorDB, (err, res) => {
    if(err){
        console.log('No se pudo conectar la DB', err);
    }else{
        console.log('Conexion DB realizada');
    }
});

app.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}`);
})