//tentar remover o layer
//https://gis.stackexchange.com/questions/41928/adding-removing-leaflet-geojson-layers

$(document).ready(function() {

	function tableGenerator(features, mun){
		var content;
		content += 
			'<tr> \
				<th> Ano </th> \
				<th> Municipio </th> \
				<th> % Matricula Creche </th> \
				<th> Matricula Pre Escola Numero </th> \
				<th> % Matricula Pre Escola </th> \
				<th> Pop_0_3 </th> \
				<th> Pop_4_5 </th> \
			</tr>';
		//iterando sobre feature para pegar os valores do schoolar;
		for(var j = 0; j < features.length; j++){
			var schoolar = features[j].properties.schoolar		
			for(var i=0; i< schoolar.length; i++){
				if(schoolar[i].Municipio.slice(0,-1) === mun){
			    content += 
			    '<tr>  \
			    	<td>' + schoolar[i].Ano + '</td> \
			    	<td>' + schoolar[i].Municipio + '</td> \
			    	<td>' + schoolar[i].Mat_Creche_Per + '</td> \
			    	<td>' + schoolar[i].Mat_Pre_Esc_Nun + '</td> \
			    	<td>' + schoolar[i].Mat_Pre_Esc_Per + '</td> \
			    	<td>' + schoolar[i].Pop_0_3 + '</td> \
			    	<td>' + schoolar[i].Pop_4_5 + '</td>'
			    '</tr>';				
				}
			}		
		}

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
		var mun = "Trindade";
		let schoolar = getSchoolarByCity(feature, mun);
		var selectYear = $('#year');
		await asyncForEachSchoolar(schoolar, async function(value, index){
			selectYear.append($("<option/>").val(index).text(value));
		})
	}

	async function initializeDropBoxVariables(feature){
		var year = $('#year option:first-child').text();
		var mun = "Trindade";
		let schoolar = getSchoolarByCity(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val(Mat_Creche_Per).text("Mat_Creche_Per"));
			selectVariable.append($("<option/>").val(Mat_Pre_Esc_Per).text("Mat_Pre_Esc_Per"));
			return
		})	
	}

	async function changeDropBoxVariables(feature, mun, year){
		$("#variable option").remove();
		let schoolar = getSchoolarByCity(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val(Mat_Creche_Per).text("Mat_Creche_Per"));
			selectVariable.append($("<option/>").val(Mat_Pre_Esc_Per).text("Mat_Pre_Esc_Per"));
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
				feature[i].properties["Ano"] = feature[i].properties.YearProperties.Ano;
				feature[i].properties["Mat_Pre_Esc_Per"] = feature[i].properties.YearProperties.Mat_Pre_Esc_Per;
				feature[i].properties["Mat_Creche_Per"] = feature[i].properties.YearProperties.Mat_Creche_Per;
			}else{
				feature[i].properties["YearProperties"] = {'Mat_Creche_Per': -1, 'Mat_Pre_Esc_Per': -1}
			}
		}
		return feature;
	}
	
	function styleMap(feat){
		var valueName = $( "#variable option:selected" ).text();
		if('Mat_Creche_Per' === valueName){
			if(feat.properties.YearProperties.Mat_Creche_Per > 71){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#00FF00"
	    	};	
			}else if(feat.properties.YearProperties.Mat_Creche_Per < 70 && feat.properties.YearProperties.Mat_Creche_Per > 51){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FFFF00"
	    	};
			}else if(feat.properties.YearProperties.Mat_Creche_Per < 50 && feat.properties.YearProperties.Mat_Creche_Per > 0){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FF0000"
	    	};
			}	else {
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FFFFFF"
	    	};
			}
		}else{
			if(feat.properties.YearProperties.Mat_Pre_Esc_Per > 71){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#00FF00"
	    	};	
			}else if(feat.properties.YearProperties.Mat_Pre_Esc_Per < 70 && feat.properties.YearProperties.Mat_Pre_Esc_Per > 51){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FFFF00"
	    	};
			}else if(feat.properties.YearProperties.Mat_Pre_Esc_Per < 50 && feat.properties.YearProperties.Mat_Pre_Esc_Per > 0){
				return {
	        color: "#000000",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FF0000"
	    	};
			}else{
				return {
	        color: "#000000",
	        opacity: 0.2,
	        fillOpacity: 0.7,
	        fillColor: "#FFFFFF"
	    	};	
			}						
		}
	}

	function addLegend(map){
    var legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		        labels = [];

		    div.innerHTML =
        '<i style="background:#FF0000";></i><span style="font-weight: 600;">0~50%</span><br>' +
        '<i style="background:#FFFF00";></i><span style="font-weight: 600;">51~70%</span><br>' +
        '<i style="background:#00FF00";></i><span style="font-weight: 600;">71~100%</span><br>' +
        '<i style="background:#FFFFFF";></i><span style="font-weight: 600;">Inexistente</span><br>'

		    return div;
		};

		legend.addTo(map);
	}

	function poligonMap(feature, map){
		var mun = "Trindade";
		var year = $( "#year option:selected" ).text();
		var valueName = $( "#variable option:selected" ).text();

		feature = getYearProperties(feature, year);
		//console.log(feature);
		var layer = L.geoJson();

		layer.addData(feature);

		layer.eachLayer(function (la) {
			la.bindPopup("<b>Ano:</b> "+la.feature.properties.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% creche:</b> "+la.feature.properties.Mat_Creche_Per+'</br>'+
				"<b>% pre-escola:</b> "+la.feature.properties.Mat_Pre_Esc_Per)
		});

		layer.addTo(map);
		layer.setStyle(styleMap);
		
		return layer;
	}

	function newPoligonMap(feature, map, layer){
		
		var mun = $('#esporte').val();
		if($('#esporte').val() == undefined){
			mun = "Trindade"
		}

		var year = $( "#year option:selected" ).text();
		var value = $( "#variable option:selected" ).text();
		var valueName = $( "#variable option:selected" ).val()
		feature = getYearProperties(feature, year);
		layer.addData(feature);
		layer.eachLayer(function (la) {
			la.bindPopup("<b>Ano:</b> "+la.feature.properties.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% creche:</b> "+la.feature.properties.Mat_Creche_Per+'</br>'+
				"<b>% pre-escola:</b> "+la.feature.properties.Mat_Pre_Esc_Per)
		});
		
		layer.setStyle(styleMap);
		
	}

	function initMap(feature){
		var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
		mymap.createPane('labels');
		mymap.getPane('labels').style.zIndex = 650;
		/*
		mymap.getPane('labels').style.pointerEvents = 'none';
		*/


		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
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
		addLegend(mymap);
		tableGenerator(feature, "Trindade")
	  return [feature,mymap,layer];
	}).then(function(featureAndMap) {	
	  $("#down").change(function(){
	  	var mun = $( "#down option:selected" ).text();
	  	changeDropBoxYears(featureAndMap[0], mun);
	  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
	  	$( "#here_table tr" ).remove();
	  	tableGenerator(featureAndMap[0], mun)
	  	return featureAndMap
	  })
	  $("#year").change(function(){ 	
	  	var year = $( "#year option:selected" ).text();
	  	var mun = $('#esporte').val();
			if(mun == ''){
				mun = "Trindade"
			}
	  	console.log(mun);
	  	changeDropBoxVariables(featureAndMap[0], mun, year);
	  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
	  })
	  $("#variable").change(function(){ 	
	  	var year = $( "#year option:selected" ).text();
	  	var mun = $('#esporte').val();
	  	//changeDropBoxVariables(featureAndMap[0], mun, year);
	  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
	  })
	  $("#esporte").autocomplete({
	    source: getNameCities(featureAndMap[0]),
	    select: function( event, ui ) {
		    changeDropBoxYears(featureAndMap[0], ui.item.value);
		  	newPoligonMap(featureAndMap[0], featureAndMap[1], featureAndMap[2])
		  	$( "#here_table tr" ).remove();
		  	tableGenerator(featureAndMap[0], ui.item.value)
	    }
	  })
	})


});