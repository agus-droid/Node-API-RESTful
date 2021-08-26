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
    },
    getArticles: (req, res) => {

        let query = Article.find({})
        let last = req.params.last;
        if(last || last != undefined){
            query.limit(3);
        }

        query.sort('-_id').exec((err, articles)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'No se pudieron devolver los artículos'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status:'error',
                    message: 'No hay artículos'
                })
            }
            return res.status(200).send({
                status: 'success',
                articles
            })
        })
    },
    getArticle: (req, res) => {

        let articleId = req.params.id;

        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'Artículo no disponible'
            });
        }

        Article.findById(articleId, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo'
                });
            }
            return res.status(200).send({
                status: 'success',
                article
            })
        });
    }
};

module.exports = controller;