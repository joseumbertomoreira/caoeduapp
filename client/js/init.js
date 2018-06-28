$(document).ready(function() {
	function getSchoolar(feature, mun){
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
	  console.log(cities);
	  return cities;		
	}	

	async function initializeDropBoxYears(feature){
		var mun = $('#down option:first-child').text();
		let schoolar = getSchoolar(feature, mun);
		var selectYear = $('#year');
		await asyncForEachSchoolar(schoolar, async function(value, index){
			selectYear.append($("<option/>").val(index).text(value));
		})
	}

	async function initializeDropBoxVariables(feature){
		var year = $('#year option:first-child').text();
		var mun = $('#down option:first-child').text();
		let schoolar = getSchoolar(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val(0).text(Mat_Creche_Per));
			selectVariable.append($("<option/>").val(1).text(Mat_Pre_Esc_Per));
			return
		})	
	}

	async function changeDropBoxVariables(feature, mun, year){
		console.log(mun);
		$("#variable option").remove();
		let schoolar = getSchoolar(feature, mun);
		var selectVariable = $('#variable');
		await asyncForEachGetVariables(schoolar,year, function(Mat_Creche_Per, Mat_Pre_Esc_Per, index){
			selectVariable.append($("<option/>").val(0).text(Mat_Creche_Per));
			selectVariable.append($("<option/>").val(1).text(Mat_Pre_Esc_Per));
			return
		})
	}

	async function changeDropBoxYears(feature, mun){
		let schoolar = getSchoolar(feature, mun);
		$("#year option").remove();
		var selectYear = $('#year');
		await asyncForEachSchoolar(schoolar, async function(value, index){
			selectYear.append($("<option/>").val(index).text(value));
		})
		var year = $('#year option:first-child').text();
		changeDropBoxVariables(feature, mun, year)
	}



	function initMap(feature){

		var mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.5);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.light',
	    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqZ2NhdWE1bDFvbDgyd3FlNWU1a3RhejUifQ.30s-PVyEjqlpW9rPEpmN7Q'
		}).addTo(mymap);
		L.geoJSON(feature).addTo(mymap);

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
		initMap(feature);
	  return feature;
	}).then(function(feature) {		
	  $("#down").change(function(){
	  	var mun = $( "#down option:selected" ).text();
	  	changeDropBoxYears(feature, mun);
	  })
	  $("#year").change(function(){
	  	console.log(feature); 	
	  	var year = $( "#year option:selected" ).text();
	  	var mun = $( "#down option:selected" ).text();
	  	changeDropBoxVariables(feature, mun, year);
	  })
	  $("#esporte").autocomplete({
	    source: getNameCities(feature)
	  });
	})


});