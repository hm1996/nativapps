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

app.put('/cursos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'horario', 'fechaInicio', 'fechaFin']);

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