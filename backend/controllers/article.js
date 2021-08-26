'use strict'

const validator = require('validator');
const Article = require('../models/article');

const controller = {
    info: (req, res) => {
        return res.status(200).send({
            autor: "Agus",
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Test',
        });
    },
    save: (req, res) => {
        const params = req.body;
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos',
            });
        }

        if(validate_title && validate_content){

            var article = new Article();
            article.title = params.title;
            article.content = params.title;
            article.image = null;

            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado',
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article
                });
            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son correctos',
            });
        }
    }
};

module.exports = controller;