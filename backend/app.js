'use strict'

const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const article_routes = require('./routes/article');

app.use('/api', article_routes);

module.exports = app;