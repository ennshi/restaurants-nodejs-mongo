const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect(process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => console.log('Server is up'));
    })
    .catch(err => console.log(err));
