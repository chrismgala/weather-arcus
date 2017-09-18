/* jshint node: true */
"use strict";

// Import Node Modules
const DarkSky = require('dark-sky'),
    moment = require('moment'),
    winston = require('winston'),
    request = require('request'),
    config = require('../../config/config');

// Configure the Winston Logger before usage
let customLevels = {
    levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
    colors: { error: 'red', warn: 'yellow', info: 'green', verbose: 'blue', debug: 'cyan', silly: 'magenta' }
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
logger.transports.console.level = 'debug';

logger.on('error', (err) => {
    logger.error("logger:", err);
});

const darksky = new DarkSky(config.DARK_SKY_API_KEY);

module.exports = {
    /**
     * Pad a single digit number with a 0.
     *
     * @param {Number} number The number being evaluated for padding.
     */
    padWithZero: (number) => {
        if (number < 10)
            return "0" + number;

        return number;
    },

    /**
     * Given a location from the User, get the 5 day forecast for their area.
     *
     * @param {Object} data The Object sent from Front-End with location and day.
     * @param {Object} res The response object from Express which will be used
     *      to send the right HTTP status and message.
     */
    getLastWeekWeather: (data, res) => {
        darksky
        .options({
            latitude: data.lat,
            longitude: data.long,
            time: moment().subtract(data.day, 'days').format("YYYY-MM-DD"),
            language: 'en',
            exclude: ['minutely', 'hourly'],
        })
        .get()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            logger.error("getLastWeekWeather():", err);
            res.status(500).send({
                message: `Unable to get weather from ${data.day} day(s) ago`
            });
        });
    },

    /**
     * Given a zip, get the lat and long of that User.
     *
     * @param {Object} data The Object sent from Front-End with the zip.
     * @param {Object} res The response object from Express which will be used
     *      to send the right HTTP status and message.
     */
    getLatLong: (data, res) => {
        request(config.GOOGLE_MAPS_GEOCODING_URL + "?address=" + encodeURIComponent(data.zip), function (error, response, body) {
            if (error) {
                logger.error("getLatLong():", error);
                res.status(500).send({
                    message: "Unable to get location"
                });
            }

            const parsed = JSON.parse(body);
            res.status(200).json(parsed.results[0].geometry.location);
        });
    },
};