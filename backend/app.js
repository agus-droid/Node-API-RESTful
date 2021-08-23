'use strict'

const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {
    return res.status(200).send({
        "autor": "Agus",
    });
});

module.exports = app;