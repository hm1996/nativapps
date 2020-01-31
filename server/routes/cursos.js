// CRUD cursos

const _ = require('underscore');
const express = require('express');
const app = express();

const Curso = require('../models/cursos');

app.post('/cursos', (req, res) => {
    let body = req.body;
    //console.log(body);
    let curso = new Curso(body);

    curso.save((err, field) => {
        if(err){
            return res.status(400).json({
                status: 400,
                data: err
            });
        }

        return res.json({
            status: 201,
            data: field
        });
    });

});

app.get('/cursos/:id', (req, res) => {
    let id = req.params.id;

    if(id == 'top'){
        return res.status(400).json({
            status: 400,
            data: 'EL valor /:meses es necesario'
        });
    }

    Curso.findById(id)
        .exec((err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: 400,
                    data: err
                });
            }
            return res.json({
                status: 200,
                data: field
            })
    });
});

app.get('/cursos', (req, res) => {
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);

    Curso.find({})
        .skip(isNaN(desde) ? 0 : desde)
        .limit(isNaN(hasta) ? 100 : hasta)
        .exec((err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: 400,
                    data: err
                });
            }
            return res.json({
                status: 200,
                data: field
            })
    });
});

app.get('/cursos/top/:meses', (req, res) => {
    let meses = Number(req.params.meses);
    
    if(isNaN(meses) || (meses < 1 || meses > 12)){
        return res.status(400).json({
            status: 400,
            data: `Meses no validos (${req.params.meses}), el valor en meses debe ser un numero entre 1 y 12`
        });
    }

    let hoy = new Date();
    
    // POR EPOCH TIME
    //let fecha = hoy
    //fecha.setTime(hoy.getTime() - (2629743000 * meses));
    

    // POR Meses
    let fecha = hoy
    fecha.setMonth((hoy.getMonth() - meses) % 12);

    fecha = fecha.toISOString().split('T')[0];
    hoy = hoy.toISOString().split('T')[0];
    
    //Solo cursos activos
    //Curso.find({'fechaInicio': {$gte: fecha}, 'fechaFin': {$gte: hoy}}})
    
    //Todos los cursos
    Curso.find({$or: [{'fechaInicio': {$gte: fecha}}, {'fechaFin': {$gte: fecha}}]})
        .sort([['numeroEstudiantes', -1]])
        .limit(3)
        .exec((err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: 400,
                    data: err
                });
            }

            return res.json({
                status: 200,
                data: field == undefined ? `No se encontraron cursos en el intervalo de fechas [${fecha}, ${hoy}]` : field
            });
    });
});

app.put('/cursos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'horario', 'fechaInicio', 'fechaFin', 'numeroEstudiantes']);

    Curso.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }
        
        return res.json({
            status: 200,
            data: field
        });
    });
});

app.delete('/cursos/:id', (req, res) => {
    let id = req.params.id;

    Curso.findByIdAndRemove(id, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }

        return res.json({
            status: 200,
            data: field
        });
    });
});

module.exports = app;