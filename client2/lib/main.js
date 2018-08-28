//https://refreshless.com/nouislider/

$(document).ready(function() {

	function getFeature(feature){
		return feature
	}

	function getSchoolarByYear(feat, year){
		for(let i = 0 ; i < feat.schoolar.length; i++){
			if(year == feat.schoolar[i].Ano){
				return feat.schoolar[i];
			}
		}
	}

	function getYearProperties(feature){
		/*
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
		*/
	}

	function getYears(polygons, mpdata){
		let years = []
		let municipalitie = polygons[0].properties.Nome;
		let filtredMpData = mpdata[municipalitie];
		
		vai ser usado pra gerar o slider
		for(let i = 0; i < filtredMpData.length; i++){
			years.push(filtredMpData[i].Ano)
		}
		let min = Math.min.apply(Math, years)
		let max = Math.max.apply(Math, years)
			
	}

	function dboxGeneration(polygons, mpdata){
		let years = []
		let municipalitie = polygons[0].properties.Nome;
		let filtredMpData = mpdata[municipalitie];
		/*
		vai ser usado pra gerar o slider
		for(let i = 0; i < filtredMpData.length; i++){
			years.push(filtredMpData[i].Ano)
		}
		let min = Math.min.apply(Math, years)
		let max = Math.max.apply(Math, years)
		*/
		let selectVariable = $('#variable');
		selectVariable.append($("<option/>").val(Mat_Creche_Per).text("Mat_Creche_Per"));
		selectVariable.append($("<option/>").val(Mat_Pre_Esc_Per).text("Mat_Pre_Esc_Per"));
	}

	function poligonMap(feature, map){

		feature = getYearProperties(feature);
		
		/*
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
		*/
	}

	function initMap(feature){
		let mymap = L.map('mapid').setView([-16.361508, -49.500561], 6.49);
		mymap.createPane('labels');
		mymap.getPane('labels').style.zIndex = 650;
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqbDJuMDkyYjFzZnMzcnF4NHhtcXZjc2MifQ.t7kEbLAbmqBoewQvM5HgDg', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox.light',
		    accessToken: 'pk.eyJ1Ijoiam9zZXVtYmVydG9tb3JlaXJhIiwiYSI6ImNqbDJuMDkyYjFzZnMzcnF4NHhtcXZjc2MifQ.t7kEbLAbmqBoewQvM5HgDg'
		}).addTo(mymap);

		$(window).on("resize", function () {
			$("#mapid").height($(window).height()-40);
			mymap.invalidateSize();
		}).trigger("resize");

		return mymap;

	}

	const handlesSlider = document.getElementById('slider-handles');

	const promise = new Promise(function(resolve, reject) {
		const municipalities = $.get({url: "/geojson", dataType:"json", success: function(polygons){}});
		const mpdata = $.get({url: "/mpdata", dataType:"json", success: function(mpdata){}});
		$.when( municipalities, mpdata ).done(function (polygons, mpdata) {
			mpdata = mpdata[0]
			let feature = polygons[0].features.filter(getFeature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );		
			resolve([feature,mpdata]);	
		});
	});

	promise.then(function(ajax) {
		let mymap = initMap(ajax[0]);
		console.log(ajax[0]);
		console.log(ajax[1]);
		dboxGeneration(ajax[0], ajax[1])
		//let layer = poligonMap(feature, mymap)
		noUiSlider.create(handlesSlider, {
			start: [ 4000, 8000 ],
			range: {
				'min': [  2000 ],
				'max': [ 10000 ]
			}
		});
	})

	noUiSlider.create(handlesSlider, {
		start: [ 4000, 8000 ],
		range: {
			'min': [  2000 ],
			'max': [ 10000 ]
		}
	});


});