// CRUD estudiantes

const _ = require('underscore');
const express = require('express');
const app = express();

const Estudiante = require('../models/estudiantes');
const Curso = require('../models/cursos');

app.post('/estudiantes', (req, res) => {
    let body = req.body;
    //console.log(body);
    let estudiante = new Estudiante(body);

    estudiante.save((err, field) => {
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

app.post('/estudiantes/cursos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['idCurso']);

    if(body.idCurso == undefined){
        return res.status(400).json({
            status: 400,
            data: 'La propiedad idCruso es requerida'
        });
    }

    Curso.findById(body.idCurso, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }
        
        Estudiante.findOneAndUpdate({_id: id, cursos: {$nin: body.idCurso} }, {$push: {cursos: body.idCurso}}, {new: true}, (err, field) => {
            if(err || field == undefined){ 
                return res.status(400).json({
                    status: 400,
                    data: field == undefined ? `Verifique que el extudiante(${id}) exista o no posea el curso(${body.idCurso}) asignado` : err
                });
            }
            Curso.findByIdAndUpdate(body.idCurso, {$inc: {numeroEstudiantes: 1}}).exec(console.log);
            return res.json({
                status: 200,
                data: field
            });
        });
        
    });

});

app.get('/estudiantes', (req, res) => {
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);
    
    Estudiante.find({})
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

app.get('/estudiantes/:id', (req, res) => {
    let id = req.params.id;

    Estudiante.findById(id)
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

app.put('/estudiantes/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'cursos']);

    Estudiante.findByIdAndUpdate(id, body, {
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

app.delete('/estudiantes/:id', (req, res) => {
    let id = req.params.id;

    Estudiante.findByIdAndRemove(id, (err, field) => {
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

app.delete('/estudiantes/cursos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['idCurso']);

    if(body.idCurso == undefined){
        return res.status(400).json({
            status: 400,
            data: 'La propiedad idCruso es requerida'
        });
    }

    Curso.findById(body.idCurso, (err, field) => {
        if(err){ 
            return res.status(400).json({
                status: 400,
                data: err
            });
        }

        Estudiante.findByIdAndUpdate(id, {$pull: {cursos: body.idCurso}}, {new: true}, (err, field) => {
            if(err){ 
                return res.status(400).json({
                    status: 400,
                    data: err
                });
            }
            Curso.findByIdAndUpdate(body.idCurso, {$inc: {numeroEstudiantes: -1}}).exec();
            return res.json({
                status: 200,
                data: field
            });
        });
        
    });

});

module.exports = app;