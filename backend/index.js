'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 8000;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/api_rest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected');
        app.listen(port, () => {
            console.log('Server running at http://localhost:' + port);
        });
});