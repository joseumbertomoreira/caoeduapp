var express = require('express');
var csv=require('csvtojson');
var convert = require('object-array-converter');
var util = require('util')
var mysql = require('mysql');
var fs = require('fs');
var xlsx = require('node-xlsx').default;
var app = express();

//res.sendFile(__dirname + filepath/filename)



app.use(express.static('/home/jose/Documentos/MPGO/client/'));

var fs = require('fs');
var geojson = JSON.parse(fs.readFileSync('goias.geojson', 'utf8'));
var munjson = JSON.parse(fs.readFileSync('mujson.json', 'utf8'));




/*
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'CAOEDU'
});

app.use(express.static('/home/jose/Documentos/Javascript/JQuery/JQuery test/client'));

function getDBObjects(dbListPar){
  var dbList = [];
  for(var i = 0; i < dbListPar.length; i++){
    console.log(dbListPar);
  } 
}


connection.query('SELECT Municipios.Municipio, SchoolarData.Cod_Munic, SchoolarData.Cod_Munic2, SchoolarData.Ano, SchoolarData.Pop_0_3, SchoolarData.Pop_4_5, SchoolarData.Taxa_Cres, SchoolarData.Mat_Creche_Nun, SchoolarData.Mat_Creche_Per, SchoolarData.Mat_Pre_Esc_Nun, SchoolarData.Mat_Pre_Esc_Per FROM Municipios JOIN SchoolarData ON Municipios.Cod_Munic = SchoolarData.Cod_Munic ORDER BY SchoolarData.Ano DESC', function (error, results, fields) {
  if (error) throw error;
  console.log(typeof JSON.parse(JSON.stringify(results)));
  console.log(JSON.parse(JSON.stringify(results)));
});



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

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO municipios (ano, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM municipios", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

app.get('/geojson', function(req, res){
  res.send(geojson);
});

app.get('/musjson', function(req, res){
  console.log(munjson);
  res.send(munjson);
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
});