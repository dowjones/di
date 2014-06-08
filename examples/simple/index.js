var ioc = require('../../')(__dirname);
module.exports = ioc.create.bind(ioc, './service');
