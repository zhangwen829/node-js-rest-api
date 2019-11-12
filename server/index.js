const express = require('express');

const bodyParser = require('body-parser');

const router = require('./api/routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

module.exports = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
