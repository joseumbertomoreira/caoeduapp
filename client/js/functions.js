






function tableGenerator(geojson, mun){
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
	for(var j = 0; j < geojson.features.length; j++){
		var features = geojson.features[j]		
		for(var i=0; i< features.properties.schoolar.length; i++){

			if(features.properties.schoolar[i].Municipio.slice(0,-1) === mun){
		    content += '<tr><td>' + features.properties.schoolar[i].Ano  +
		    features.properties.schoolar[i].Municipio + 
		    features.properties.schoolar[i].Mat_Creche_Per +
		    features.properties.schoolar[i].Mat_Pre_Esc_Nun +
		    features.properties.schoolar[i].Mat_Pre_Esc_Per +
		    features.properties.schoolar[i].Pop_0_3
		    features.properties.schoolar[i].Pop_4_5
		    '</td></tr>';				
			}
		}		
	}


	content += "</table>"

	$('#here_table').append(content);
}


function dropBoxYears(features){
	var select = $('#year');
	var countArray = [];
	$("#year option").remove();
	features.properties.schoolar.forEach(function(element, index){
		if(countArray.indexOf(element.Ano) === -1){
			countArray.push(element.Ano)
			select.append($("<option/>").val(index).text(element.Ano));
		}
	})
}

function dropBoxNameCities(geojson){
	var select = $('#down');
	var countArray = [];
	//iterando features para montar o dropbox com os nomes dos municipios
	geojson.features.forEach(function(element, index){
		if(index === 0)
			dropBoxYears(element);

		if(countArray.indexOf(element.properties.Nome) === -1){
			countArray.push(element.properties.Nome)
			select.append($("<option/>").val(index).text(element.properties.Nome));
			if(countArray.length == 1){
				var mun = $( "#down option:selected" ).text();
				tableGenerator(geojson, mun);				
			}
		}

	})	
}

function styleGeojson(feature, year){
	if(year !== ''){
		//var mun = $( "#down option:selected" ).text();			
		//iterando sobre o schoolar de um feature; para pegar os valors em porcentagem
		for(var i = 0; i < feature.properties.schoolar.length; i++){
			if((year === feature.properties.schoolar[i].Ano.toString())){
				if(feature.properties.schoolar[i].Mat_Pre_Esc_Per > 71){
					return {
		        color: "#00FF00"
		    	};	
				}else if(feature.properties.schoolar[i].Mat_Creche_Per < 70 && feature.properties.schoolar[i].Mat_Creche_Per > 51){
					return {
		        color: "#FFFF00"
		    	};
				}else if(feature.properties.schoolar[i].Mat_Creche_Per < 50){
					return {
		        color: "#FF0000"
		    	};
				}	
			}	
		}		
	}
}

function lMap(mymap, geojson, year){
	L.geoJSON(geojsonFeature,{
		style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
	}).addTo(map);
}

function initMap(geojson) {
	var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
	}).addTo(mymap);

	lMap(mymap, geojson)

	return mymap;
}

function init() {

	var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){
	}});
	 
	$.when( d1 ).done(function (geojson) {

	  dropBoxNameCities(geojson);
		var mymap = initMap(geojson);

		$( "#down" ).change(function () {  
	    var mun = $( "#down option:selected" ).text();
			geojson.features.forEach(function(element, index){
				if(mun === element.properties.Nome)
					dropBoxYears(element);
			})
	  })

		$( "#year" ).change(function () {  
	    var year = $( "#year option:selected" ).text();
	    lMap(mymap,geojson,year);
	  })

	  $( "#down" ).change(function () {  
	    var mun = $( "#down option:selected" ).text();
	    $("#here_table tr").remove();
	    tableGenerator(geojson, mun);
	  })
	 	$("#esporte").autocomplete({
      source: 
    });

	});

}