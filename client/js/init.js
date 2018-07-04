//tentar remover o layer
//https://gis.stackexchange.com/questions/41928/adding-removing-leaflet-geojson-layers

$(document).ready(function() {

	function tableGenerator(features, mun){
	var mun = $( "#down option:selected" ).text();
	var content = "<table>";
	content += '<tr><th>' +
		'Ano' +
		'Municipio' +
		'Mat_Creche_Per' +
		'Mat_Pre_Esc_Nun' +
		'Mat_Pre_Esc_Per' +
		'Pop_0_3' +
		'Pop_4_5' +
		'</th></tr>';
		//iterando sobre feature para pegar os valores do schoolar;
		for(var j = 0; j < features.length; j++){
			var schoolar = features[j].properties.schoolar		
			for(var i=0; i< schoolar.length; i++){

				if(schoolar[i].Municipio.slice(0,-1) === mun){
			    content += '<tr><td>' + schoolar[i].Ano  +
			    schoolar[i].Municipio + 
			    schoolar[i].Mat_Creche_Per +
			    schoolar[i].Mat_Pre_Esc_Nun +
			    schoolar[i].Mat_Pre_Esc_Per +
			    schoolar[i].Pop_0_3
			    schoolar[i].Pop_4_5
			    '</td></tr>';				
				}
			}		
		}


		content += "</table>"

		$('#here_table').append(content);
	}

	function getSchoolarByCity(feature, mun){
		for(let i = 0; i < feature.length; i++){
			if(feature[i].properties.Nome == mun){
				return feature[i].properties.schoolar;				
			}
		}
	}

	function getFeature(feature){
		return feature
	}

	const asyncForEachFeature = function(array, callback){
	  for (let index = 0; index < array.length; index++) {
	    callback(array[index].properties.Nome, index);
	  }
	}

	const asyncForEachSchoolar = function(schoolar, callback){
		for (let index = 0; index < schoolar.length; index++) {
			callback(schoolar[index].Ano, index);
	  }	
	}

	const asyncForEachGetVariables = function(schoolar, year, callback){
		for (let index = 0; index < schoolar.length; index++) {
			if(year == schoolar[index].Ano){
				callback(schoolar[index].Mat_Creche_Per, schoolar[index].Mat_Pre_Esc_Per, index);	
			}
	  }	
	}

	async function initializeDropBoxNameCities(feature){
		var select = $('#down');
		await asyncForEachFeature(feature, async function(value, index){
			select.append($("<option/>").val(index).text(value));
		})
	}

	function getNameCities(array){
		var cities = []
		for (let index = 0; index < array.length; index++) {
	    cities.push(array[index].properties.Nome)
	  }
	  return cities;		
	}	

	async function initializeDropBoxYears(feature){
		var mun = $('#down option:first-child').text();
		let schoolar = getSchoolarByCity(feature, mun);
		var selectYear = $('#year');
		await asyncForEachSchoolar(schoolar, async function(value, index){
			selectYear.append($("<option/>").val(index).text(value));
		})
	}

	async function initializeDropBoxVariables(feature){
		var year = $('#year option:first-child').text();
		var mun = $('#down option:first-child').text();
		let schoolar = getSchoolarByCity(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val("Mat_Creche_Per").text(Mat_Creche_Per));
			selectVariable.append($("<option/>").val("Mat_Pre_Esc_Per").text(Mat_Pre_Esc_Per));
			return
		})	
	}

	async function changeDropBoxVariables(feature, mun, year){
		$("#variable option").remove();
		let schoolar = getSchoolarByCity(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val(0).text(Mat_Creche_Per));
			selectVariable.append($("<option/>").val(1).text(Mat_Pre_Esc_Per));
			return
		})
	}

	async function changeDropBoxYears(feature, mun){
		let schoolar = getSchoolarByCity(feature, mun);
		$("#year option").remove();
		var selectYear = $('#year');
		await asyncForEachSchoolar(schoolar, async function(value, index){
			selectYear.append($("<option/>").val(index).text(value));
		})
		var year = $('#year option:first-child').text();
		changeDropBoxVariables(feature, mun, year)
	}	


	function getValues(schoolar, year, valueName){
		for(let i = 0; i < schoolar.length; i++){
			if(schoolar[i].Ano == year){
				if(Object.keys(schoolar[i])[8] == valueName){
					return schoolar[valueName];
				}
			}
		}
	}

	function getSchoolarByYear(feat, year){
		for(let i = 0 ; i < feat.schoolar.length; i++){
			if(year == feat.schoolar[i].Ano){
				return feat.schoolar[i];
			}
		}
	}

	function getYearProperties(feature, year){
		for(let i = 0; i < feature.length; i++){
			if(getSchoolarByYear(feature[i].properties, year) != undefined){
				feature[i].properties["YearProperties"] = getSchoolarByYear(feature[i].properties, year);
			}else{
				feature[i].properties["YearProperties"] = {'Mat_Creche_Per': -1, 'Mat_Pre_Esc_Per': -1}
			}
		}
		return feature;
	}
	
	function styleMap(feat, valueName){
		if('Mat_Creche_Per' == valueName){
			if(feat.properties.YearProperties.Mat_Creche_Per > 71){
				return {
	        color: "#00FF00"
	    	};	
			}else if(feat.properties.YearProperties.Mat_Creche_Per < 70 && feat.properties.YearProperties.Mat_Creche_Per > 51){
				return {
	        color: "#FFFF00"
	    	};
			}else if(feat.properties.YearProperties.Mat_Creche_Per < 50 && feat.properties.YearProperties.Mat_Creche_Per > 0){
				return {
	        color: "#FF0000"
	    	};
			}	else {
				return {
	        color: "#FFFFFF"
	    	};
			}
		}else{
			if(feat.properties.YearProperties.Mat_Pre_Esc_Per > 71){
				return {
	        color: "#00FF00"
	    	};	
			}else if(feat.properties.YearProperties.Mat_Pre_Esc_Per < 70 && feat.properties.YearProperties.Mat_Pre_Esc_Per > 51){
				return {
	        color: "#FFFF00"
	    	};
			}else if(feat.properties.YearProperties.Mat_Pre_Esc_Per < 50 && feat.properties.YearProperties.Mat_Pre_Esc_Per > 0){
				return {
	        color: "#FF0000"
	    	};
			}else{
				return {
	        color: "#FFFFFF"
	    	};	
			}						
		}
	}

	function poligonMap(feature, map){
		var mun = $( "#down option:selected" ).text();
		var year = $( "#year option:selected" ).text();
		var value = $( "#variable option:selected" ).text();
		var valueName = $( "#variable option:selected" ).val()
		console.log(mun, year, value);

		feature = getYearProperties(feature, year);

		var layer = L.geoJson();
		layer.addData(feature);
		layer.addTo(map);
		layer.setStyle(styleMap);

		
		/*
		L.geoJSON(feature,{
			style: styleMap
		}).addTo(map);
		*/

		return layer;
	}

	function newPoligonMap(feature, map, layer){
		//map.removeLayer(layer)
		var mun = $( "#down option:selected" ).text();
		var year = $( "#year option:selected" ).text();
		var value = $( "#variable option:selected" ).text();
		var valueName = $( "#variable option:selected" ).val()
		console.log(mun, year, value);
		feature = getYearProperties(feature, year);
		/*
		layer = L.geoJson();
		layer.addData(feature);
		layer.addTo(map);
		*/
		layer.setStyle(styleMap);
		
	}

	function initMap(feature){

		var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.light',
	    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
		}).addTo(mymap);
		return mymap;

	}

	var promise = new Promise(function(resolve, reject) {
		var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){}});
		$.when( d1 ).done(function (geojson) {
			var feature = geojson.features.filter(getFeature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );
			resolve(feature);	
		});
	});

	promise.then(function(feature) {
		initializeDropBoxNameCities(feature);
		initializeDropBoxYears(feature);
		initializeDropBoxVariables(feature);
		var mymap = initMap(feature);
		var layer = poligonMap(feature, mymap)
		tableGenerator(feature)
	  return [feature,mymap,layer];
	}).then(function(featureAndMap) {	
	  $("#down").change(function(){
	  	var mun = $( "#down option:selected" ).text();
	  	changeDropBoxYears(featureAndMap[0], mun);
	  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
	  	$( "#here_table tr" ).remove();
	  	tableGenerator(featureAndMap[0])
	  	return featureAndMap
	  })
	  $("#year").change(function(){ 	
	  	var year = $( "#year option:selected" ).text();
	  	var mun = $( "#down option:selected" ).text();
	  	changeDropBoxVariables(featureAndMap[0], mun, year);
	  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
	  })
	  $("#esporte").autocomplete({
	    source: getNameCities(featureAndMap[0])
	  })
	})


});