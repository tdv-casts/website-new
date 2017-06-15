// @flow

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRouter = require('./routers/api');

const app = express();
app.set('port', (process.env.PORT || 3001));
app.set('json spaces', 4);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend/build'));
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tdv');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

process.on('exit', () => {});