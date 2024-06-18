const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['POST'], // Allow only these methods
    credentials: true, // Allow cookies to be sent with requests
  };

app.use(cors(corsOptions));

app.use(routes);

app.listen(5000, () => console.log('App is listening on port 5000...'));