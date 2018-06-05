var express = require('express');
var convert = require('object-array-converter');
var util = require('util');
var consign = require('consign');
var app = express();

app.use(express.static('/home/jose/Documentos/Trabalho/caoeduapp/client'));



consign()
  .include('middleware')
  .then('controllers')
  .then('routers')
  .into(app);

/*
obs.: talvez sera usado isso pq tem no client
var xlsx = require('node-xlsx').default;
var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`Planilha Dados para CSI_2.xlsx`))
var tuples = []
for(var i = 0; i < workSheetsFromBuffer[0].data.length; i++){
  if(workSheetsFromBuffer[0].data[i].length > 0){
    tuples.push(workSheetsFromBuffer[0].data[i]);
  }
}
*/
//console.log(geojson.features);
/*
geojson['features'] = geojson.features.map(feat =>{ 
  console.log(feat);
  if(munjson[feat.properties.Nome]){
    feat.properties["link"]= munjson[feat.properties.Nome];
  }
   return feat.properties;
})
*/
/*
geojson.features.forEach(function(feat){
  if(munjson[feat.properties.Nome]){
    feat.properties["link"]= munjson[feat.properties.Nome];
  }
  console.log(feat.properties);
});
*/

/*
app.get('/geojson', function(req, res){
  res.send(geojson);
});

app.get('/musjson', function(req, res){
  //console.log(munjson);
  //res.send(munjson);
});
*/

app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
});