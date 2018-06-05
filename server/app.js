var express = require('express');
var convert = require('object-array-converter');
var util = require('util');
var consign = require('consign');
var app = express();

app.use(express.static('/home/jose/Documentos/Trabalho/caoeduapp/client'));

console.log(__dirname);

consign()
  .include('middleware')
  .then('controllers')
  .then('routers')
  .into(app);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
});