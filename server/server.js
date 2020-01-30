require('./config/config');

const express = require('express');
const app = express();

//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

const puerto = process.env.PORT;


// CRUD estudiantes
app.post('/estudiantes', (req, res) => {
    let body = req.body;

    if(body.correo == undefined){
        res.status(400).json({
            status: 400,
            data: 'Es necesaria la propiedad "correo"'
        });
    }else{
        res.json({
            status: 200,
            data: body
        });
    }

});

app.get('/estudiantes', (req, res) => {
    res.json('get estudiantes');
});

app.put('/estudiantes/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/estudiantes', (req, res) => {
    res.json('delete estudiantes');
});

// CRUD cursos
app.post('/cursos', (req, res) => {
    let body = req.body;

    if(body.nombre == undefined){
        res.status(400).json({
            status: 400,
            data: 'Es necesaria la propiedad "nombre"'
        });
    }else{
        res.json({
            status: 200,
            data: body
        });
    }

});

app.get('/cursos', (req, res) => {
    res.json('get cursos');
});

app.put('/cursos/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/cursos', (req, res) => {
    res.json('delete cursos');
});


app.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}`);
})