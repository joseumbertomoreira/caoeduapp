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


function dropBox(v2){
	var mySelect = $('#down');
	console.log('AQUI', v2);
	$.each(v2, function(val, text) {
		console.log(val);
		/*
    mySelect.append(
      $('<option></option>').val(val.properties.Nome).html(text)
    );
    */
	});
}


function initMap(v1, v2) {

	var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
	}).addTo(mymap);

	L.geoJSON(v2,{
		onEachFeature: function (feature, layer) {
			if(munjson[feature.properties.Nome]){
		    layer.bindPopup('<h1>'+feature.properties.Nome+'</h1><a href='+munjson[feature.properties.Nome]+'>Informações</a>');
		  }
	  }
	}).addTo(mymap);


}


function init() {

	var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){
	}});

	var d2 = $.get({url: "/musjson", dataType:"json", success: function(geojson1){
	}});
	 
	$.when( d1, d2 ).done(function ( v1, v2 ) {
	  dropBox(v2);
		initMap(v1, v2)

	});

}