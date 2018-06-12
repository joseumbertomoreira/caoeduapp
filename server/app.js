var express = require('express');
var convert = require('object-array-converter');
var util = require('util');
var consign = require('consign');
var chain = require('middleware-chain')
var app = express();

app.use(express.static('/home/jose/Documentos/Trabalho/caoeduapp/client'));

consign()
  .include('middleware')
  .then('controllers')
  .then('routers')
  .into(app);

chain([
  app.middleware.repository.municipios,
  app.middleware.repository.db,
  app.middleware.repository.mergeGeoJSONQuery
]);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
});