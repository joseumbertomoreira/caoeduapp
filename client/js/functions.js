/*
function select(json, mymap, layer){

	var $select = $('#down'); 
		$select.find('option').remove();  
		$.each(json,function(key,value) 
		{	
			
		  $select.append('<option value='+value.Id + '>' + value.NomeEscola + '</option>')
		
		});

		$select.change(function() {
    	$("select option:selected" ).each(function() {
      	var str = $( this ).text();


  			$.get({url: "/geojson", success: function(geojson){
  				$.each(json,function(key,value){	
  					if(value.NomeEscola == str){
  						
  						baseMap(mymap, layer, value.Latitude, value.Longitude);

  					}	
  				})
  			}});    	
    		
    	});
  	}).trigger( "change" );

}

function baseMap(mymap, layer, Latitude, Longitude){

	if (layer) {
    mymap.removeLayer(layer);
  }

  mymap.panTo(new L.LatLng(Latitude, Longitude));
	var layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
	  accessToken: 'your.mapbox.access.token'
	}).addTo(mymap);
	var marker = L.marker([Latitude, Longitude]).addTo(mymap);

}

*/

function getColor(d) {
  return d > 70   ? '#09ff00' :
         d > 50   ? '#ffdb00' :
                    '#FF0000';
}


function style(feature) {
	var year = $( "#year option:selected" ).text();
	var mun = ( "#down option:selected" ).text();
	feature.properties.schoolar.forEach(function(element, index){
		if(mun === element.Ano && year === element.Municipio){
			return {
        fillColor: getColor(element.Mat_Creche_Per),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };	
		}
	})
}

function tableGenerator(schoolData, mun){
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
	for(var i=0; i<schoolData[0].length; i++){
		if(schoolData[0][i].Municipio == mun){
	    content += '<tr><td>' + schoolData[0][i].Ano  +
	    schoolData[0][i].Municipio + 
	    schoolData[0][i].Mat_Creche_Per +
	    schoolData[0][i].Mat_Pre_Esc_Nun +
	    schoolData[0][i].Mat_Pre_Esc_Per +
	    schoolData[0][i].Pop_0_3
	    schoolData[0][i].Pop_4_5
	    '</td></tr>';				
		}
	}

	content += "</table>"

	$('#here_table').append(content);
}

function optionHandler(schoolData){
	$( "select" ).change(function () {  
    var mun = $( "select option:selected" ).text();
    $("#here_table tr").remove();
    tableGenerator(schoolData, mun);
  })
}

function dropBoxYears(features){
	var select = $('#year');
	var countArray = [];
	$("#year option").remove();
	features.properties.schoolar.forEach(function(element, index){
		if(countArray.indexOf(element.Ano) === -1){
			countArray.push(element.Ano)
			console.log('atualizou!')
			select.append($("<option/>").val(index).text(element.Ano));
		}
	})
}

function getYearFromCity(geojson){
	$( "#down" ).change(function () {  
    var mun = $( "#down option:selected" ).text();
		geojson.features.forEach(function(element, index){
			if(mun === element.properties.Nome)
				dropBoxYears(element);

		})
  })	
}


function dropBoxNameCities(geojson){
	var select = $('#down');
	var countArray = [];

	geojson.features.forEach(function(element, index){
		if(index === 0)
			dropBoxYears(element);

		if(countArray.indexOf(element.properties.Nome) === -1){
			countArray.push(element.properties.Nome)
			select.append($("<option/>").val(index).text(element.properties.Nome));
		}
	})	
}


function initMap(geojson) {
	var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
	}).addTo(mymap);

	L.geoJSON(geojson,{
		style: function(feature){
	  	var year = $( "#year option:selected" ).text();
			var mun = $( "#down option:selected" ).text();			
			for(var i = 0; i < feature.properties.schoolar.length; i++){
				if((year === feature.properties.schoolar[i].Ano.toString()) && (mun === feature.properties.schoolar[i].Municipio.slice(0,-1))){
					console.log('ola')
					return {
		        color: "#ff0000"
		    	};	
				}	
			}
	  }
	}).addTo(mymap);
}

function mergeGeoJson(geojson, schoolData){
	geojson[0].features.forEach(function(element, index){
		
	})
}

function init() {

	var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){
	}});
	 
	$.when( d1 ).done(function (geojson) {		
	  dropBoxNameCities(geojson);
	  getYearFromCity(geojson);
	  console.log(geojson);

	  //mergeGeoJson(geojson, schoolData);
	  //optionHandler(schoolData);
		initMap(geojson)
	});

}