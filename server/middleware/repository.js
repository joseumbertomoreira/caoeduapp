var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'admin',
  password : 'admin',
  database : 'CAOEDU'
});

module.exports = function(app){

	Repository = {};

	Repository.municipios = function(){
		var municipios = JSON.parse(fs.readFileSync(__dirname+'/../geospatial/goias.geojson', 'utf8'));
		return municipios;
	}

	Repository.db = function(callback){
		connection.query('SELECT Municipios.Municipio,\
                   SchoolarData.Cod_Munic,\
                    SchoolarData.Cod_Munic2,\
                     SchoolarData.Ano, SchoolarData.Pop_0_3,\
                      SchoolarData.Pop_4_5,\
                       SchoolarData.Taxa_Cres,\
                        SchoolarData.Mat_Creche_Nun,\
                         SchoolarData.Mat_Creche_Per,\
                          SchoolarData.Mat_Pre_Esc_Nun,\
                           SchoolarData.Mat_Pre_Esc_Per\
                            FROM Municipios JOIN SchoolarData\
                             ON Municipios.Cod_Munic = SchoolarData.Cod_Munic\
                              ORDER BY SchoolarData.Ano DESC', function (error, results, fields) {
		  if (error){
		  	console.log('ola', error);
		  }else{
		  	var object = JSON.parse(JSON.stringify(results));
		  	callback(object);
		  }
		});
	}

	return Repository;

}
