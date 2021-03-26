const express = require('express');
const commonApp = express();
const room = require('./room');

exports.getRoutes = () => {
    commonApp.use('/room', room);
    return commonApp;
};
