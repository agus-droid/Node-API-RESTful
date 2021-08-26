'use strict'

const express = require('express');
const ArticleController = require('../controllers/article');

const router = express.Router();

router.get('/', ArticleController.test);
router.get('/info', ArticleController.info);

router.post('/save', ArticleController.save);

module.exports = router;