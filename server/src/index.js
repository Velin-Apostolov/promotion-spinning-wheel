const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'https://coco-spinning-wheel.web.app',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.json());

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is listening on port: ${PORT}...`));