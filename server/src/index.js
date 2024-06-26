const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST'], // Allow only these methods
    credentials: true, // Allow cookies to be sent with requests
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

console.log(PORT);

app.listen(PORT, () => console.log(`App is listening on port: ${PORT}...`));