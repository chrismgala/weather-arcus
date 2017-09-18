/* jshint node: true */
"use strict";

const express = require('express'),
    util = require('./weather.util');

module.exports = (weather) => {
    /**
     * Query Weatherbit.io's API for data.
     */
    weather.get('/weather/:lat/:long/:day', (req, res) => {
        util.getLastWeekWeather(req.params, res);
    });

    /**
     * Query Google Maps Geocoding API for lat and long using a zip code.
     */
    weather.get('/location/:zip', (req, res) => {
        util.getLatLong(req.params, res);
    });
};