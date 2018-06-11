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

function dropBox(geojson){
	//var mySelect = $('<select>').appendTo('#down');
	var select = $('#down');
	var countArray = [];	
	for(var i = 0; i < geojson[0].length; i++){
		if(countArray.indexOf(geojson[0][i].Municipio) === -1){
			countArray.push(geojson[0][i].Municipio)
			select.append($("<option />").val(i).text(geojson[0][i].Municipio));
		}
	}

	tableGenerator(geojson, geojson[0][0].Municipio)

}


function initMap(geojson, schoolData) {
	var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
	}).addTo(mymap);

	L.geoJSON(geojson,{
		onEachFeature: function (feature, layer) {
			if(geojson[feature.properties.Nome]){
		    layer.bindPopup('<h1>'+feature.properties.Nome+'</h1><a href='+geojson[feature.properties.Nome]+'>Informações</a>');
		  }
	  }
	}).addTo(mymap);
}


function init() {

	var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){
	}});

	var d2 = $.get({url: "/musjson", dataType:"json", success: function(geojson1){
	}});
	 
	$.when( d1, d2 ).done(function ( geojson, schoolData ) {
	  dropBox(schoolData);
	  optionHandler(schoolData);
		initMap(geojson, schoolData)
	});

}