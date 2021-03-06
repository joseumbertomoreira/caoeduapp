var express = require('express');
var convert = require('object-array-converter');
var util = require('util');
var consign = require('consign');
var chain = require('middleware-chain')
var bodyParser = require('body-parser')
var app = express();


app.use(express.static(__dirname + './../client2'));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))


consign()
  .include('middleware')
  .then('routers')
  .into(app);

chain([
  app.middleware.repository.municipios,
  app.middleware.repository.transporte,
  app.middleware.repository.schoolar,
  app.routers.geojson.geojson
]);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
});