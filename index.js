const { dirname } = require('path');

global.__basedir = __dirname;
global.__appdir = dirname(require.main.filename);

var Hajar = { createInvoice: require('./invoice') };


module.exports = Hajar;