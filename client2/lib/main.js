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

	const promise = new Promise(function(resolve, reject) {
		const municipalities = $.get({url: "/geojson", dataType:"json", success: function(geojson2){}});
		const mpdata = $.get({url: "/mpdata", dataType:"json", success: function(mpdata){}});
		$.when( municipalities, mpdata ).done(function (geojson, mpdata) {
			mpdata = mpdata[0]
			let feature = geojson[0].features.filter(getFeature);
			console.log(mpdata);
			console.log(feature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );		
			resolve(feature);	
		});
	});

	promise.then(function(feature) {
		let mymap = initMap(feature);
		console.log(feature);
		//let layer = poligonMap(feature, mymap)
	})


});