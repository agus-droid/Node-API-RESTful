'use strict'

const validator = require('validator');
const Article = require('../models/article');
const fs = require('fs');
const path = require('path');

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
    },
    update: (req, res) => {
        let articleId = req.params.id;
        let params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos',
            });
        }

        if(validate_title && validate_content){
            Article.findOneAndUpdate({_id:articleId},params,{new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar',
                    });
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el artículo',
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Validación incorrecta',
            });
        }

    },
    delete: (req, res) => {
        let articleId = req.params.id;

        Article.findOneAndDelete({_id:articleId}, (err, articleRemoved) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al intentar borrar',
                });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el artículo',
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },
    upload: (req, res) => {
        let file_name = 'Imagen no subida';
        let file_path = req.files.file0.path;
        
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //Windows
        let file_split = file_path.split('\\');

        //Linux, Mac
        //let file_split = file_path.split('/');

        file_name = file_split[2];
        let extension_split = file_name.split('\.');
        let file_ext = extension_split[1];
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'Extensión del archivo inválida'
                });
            });
        } else {
            let articleId = req.params.id;
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                if (err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen'
                    });    
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    },
    getImage: (req, res) => {
        let file = req.params.image;
        let path_file = './upload/articles/' + file;
        if (fs.existsSync(path_file)) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe'
            });
        }
    },
    search: (req, res) => {
        let searchString = req.params.search; 
        Article.find({ "$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort('_date')
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en el servidor'
                });
            }

            if(articles.length <= 0 || !articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontraron articulos'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }
};

module.exports = controller;