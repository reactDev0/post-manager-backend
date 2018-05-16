'use strict';

var server = require('../server');
var mongodbDs = server.dataSources.mongodbDs;
var tables = ['Post', 'Media', 'CustomUser'];
mongodbDs.automigrate(tables, function(err) {
  if (err) throw err;
  console.log('Loopback tables [' + tables + '] created in ', mongodbDs.adapter.name);
  mongodbDs.disconnect();
});
