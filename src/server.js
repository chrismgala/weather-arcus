"use strict";

/* SETUP */
const express = require('express'),
    winston = require('winston'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

const config = require('./config/config');

const port = config.PORT || 8080,
    app = express();

/* CONFIGURATION */
// Configure the Winston Logger before usage
let customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        verbose: 'blue',
        debug: 'cyan',
        silly: 'magenta'
    }
};

const tsFormat = () => (new Date()).toLocaleTimeString(); /* Prepare the date format for timestamps */
const logger = new (winston.Logger) ({
    transports : [
        // colorize the output to the console
        new (winston.transports.Console) ({
            timestamp : tsFormat,
            colorize : true
        })
    ],
    levels : customLevels.levels
});

winston.addColors(customLevels.colors);
logger.transports.console.level = 'silly';

logger.on('error', function (err) {
    logger.error("logger:", err);
});

// Set the static files locations
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/../node_modules'));

// parse the following: application/x-www-form-urlencoded, application/json, application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// log every request to the console
app.use(morgan('dev'));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

/* ROUTES */
require('./app/controllers/weather.routes')(app, logger);

/* ANGULAR APP */
app.all('/*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/* START OUR ENGINES */
app.listen(port);
logger.info("App listening on port " + port);
