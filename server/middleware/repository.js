const mysql = require('mysql');
const fs = require('fs');
const asyncLoop = require('node-async-loop');
const parsedb = require('./parsedb.js');

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'CAOEDU'
});

module.exports = function(app){

	Repository = {};

	Repository.municipios = function(context, next){
		let municipios = JSON.parse(fs.readFileSync(__dirname+'/../geospatial/goias.geojson', 'utf8'));
		context.municipios = municipios
		return next();
	}

	Repository.db = function(context, next){
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
		  	console.log(error);
		  }else{
		  	let mpdata = JSON.parse(JSON.stringify(results));
		  	let modataparsed = parsedb.parse(mpdata);
		  	context.mpdata = modataparsed;
		  	next();
		  }
		});

	}
	/*
	Repository.mergeGeoJSONQuery = function(context, next){

		context.municipios.features.forEach(function(element, index, array){			
			if(index == array.length)
				console.log(index);
				next();
			
			element.properties["schoolar"] = [];
			for(var i = 0; i < context.schoolar.length; i++){				
				if(element.properties.Nome === context.schoolar[i].Municipio.slice(0,-1)){
					element.properties["schoolar"].push(context.schoolar[i]);
				}				
			}
		})

	}
	*/
	
	Repository.insertData = function(xlsx){
		console.log("insertData");
		console.log(xlsx);
		asyncLoop(xlsx, function (line, next){

			var query = "INSERT INTO SchoolarData (Cod_Munic, \
			Cod_Munic2, \
			Ano, \
			Pop_0_3, \
			Pop_4_5, \
			Taxa_Cres, \
			Mat_Creche_Nun, \
			Mat_Creche_Per, \
			Mat_Pre_Esc_Nun, \
			Mat_Pre_Esc_Per)\
			VALUES ("+line.Cod_Munic+",\
			"+line.Cod_Munic2+",\
			"+line.Ano+",\
			"+line["Pop. 0 a 3 anos estimada"]+",\
			"+line["Pop. 4 a 5 anos estimada"]+",\
			0.00,\
			"+line["Nº mat. Creche"]+",\
			"+line["% mat. creches"]+",\
			"+line["% mat. pré-escola"]+",\
			"+line["Nº mat. Pré-escola"]+")";

			connection.query(query, function (err, result) {
		    if (err) throw err;
		    console.log("1 record inserted");
		    next();
		  });
			
		}, function (err)
		{
		    if (err)
		    {
		        console.error('Error: ' + err.message);
		        return;
		    }
		 
		    console.log('Finished!');
		});
		
	}
	
	return Repository;

}

//utilizar o codigo do municipio;
//mysql, extensao espacial
//soluçao maelhor postgis;
//pstgress e postgis(utilizar);


//retirar o dropdbox de bosca, usar so a busca de digitar
//mostrar os dados a partir de clicque no municipio

//poup mostrar os valores de que sejam favoraveis aquele municipio;
//deixar a arquitetura padrao;

//app lapig com angular 2
//http://dpat.lapig.iesa.ufg.br:4000/map
//https://github.com/lapig-ufg/d-pat/tree/master/src/client
//z-index: altera o valor;
