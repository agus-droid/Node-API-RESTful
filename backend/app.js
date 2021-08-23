'use strict'

const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).send(`
       <h1>It's working lul</h1> 
    `);
});

module.exports = app;