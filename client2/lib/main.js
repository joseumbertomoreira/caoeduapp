$(document).ready(function() {

	let feature;
	let mpData;

	const variables = {
		'% matricula creche': 'Mat_Creche_Per',
		'% matricula pre-escola': 'Mat_Pre_Esc_Per'
	}

	function getFeature(feature){
		return feature
	}

	function sliderPipDynamics(){

		var pips = pipsSlider.querySelectorAll('.noUi-value');

		function clickOnPip ( ) {
		    var value = Number(this.getAttribute('data-value'));
		    pipsSlider.noUiSlider.set(value);

		}

		for ( var i = 0; i < pips.length; i++ ) {
	    // For this example. Do this in CSS!
	    pips[i].style.cursor = 'pointer';
	    pips[i].addEventListener('click', clickOnPip);
		}

	}

	function getYear(list, year){

		for(let i = 0; i < list.length; i++){
			if(list[i].Ano == year)
				return list[i]
		}
	}

	function styleMap(feat){
		let value = $( "#variable option:selected" ).text()
		let year = pipsSlider.noUiSlider.get();
		let aggregateDataByyear;

		if(mpData[feat.properties.Nome] !== undefined)
			aggregateDataByyear = getYear(mpData[feat.properties.Nome], year);
		
		console.log(feat.properties.Nome, mpData[feat.properties.Nome], aggregateDataByyear)

		if(mpData[feat.properties.Nome] !== undefined){
			console.log(value)
			console.log(variables[value])
			console.log(aggregateDataByyear[variables[value]])
			if(aggregateDataByyear[variables[value]] >= 92){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#D7191C"
	    	};
			} 
			else if(aggregateDataByyear[variables[value]] < 92 && aggregateDataByyear[variables[value]] >= 72){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FDAE61"
	    	};
			}
			else if(aggregateDataByyear[variables[value]] < 72 && aggregateDataByyear[variables[value]] >= 53){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#FFFFBF"
	    	};
	    }
  		else if(aggregateDataByyear[variables[value]] < 53 && aggregateDataByyear[variables[value]] >= 22){
  			console.log(aggregateDataByyear[variables[value]])
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#A6D96A"
	    	};
	    }
	    else if(aggregateDataByyear[variables[value]] < 22 && aggregateDataByyear[variables[value]] >= 0){
				return {
	        color: "#1A9641",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#1A9641"
	    	};
			}		
		}
	}

	function componentMaker(mymap){
		let years = []
		let municipalitie = feature[0].properties.Nome;
		let filtredMpData = mpData[municipalitie];

		$("#municipality").val(municipalitie);
		
		let selectVariable = $('#variable');
		selectVariable.append($("<option/>").val(filtredMpData[0].Mat_Creche_Per).text("% matricula creche"));
		selectVariable.append($("<option/>").val(filtredMpData[0].Mat_Pre_Esc_Per).text("% matricula pre-escola"));
		
		let count = 0;

		for(let i = 0; i < filtredMpData.length; i++){
			years.push(filtredMpData[i].Ano)
			count++
		}

		let min = Math.min.apply(Math, years)
		let max = Math.max.apply(Math, years)

		noUiSlider.create(pipsSlider, {
			range: {
        min: min,
        max: max
   		},
	    start: [ min ],
	    pips: { mode: 'count', values: count }
		});

		sliderPipDynamics()
		poligonMap(mymap)

	}

	function poligonMap(map){
		
		let layer = L.geoJson();

		layer.addData(feature);

		/*
		layer.eachLayer(function (la) {
			console.log(la.feature.properties.Nome);
			//get value from slider
			la.bindPopup("<b>Ano:</b> "+la.feature.properties.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% creche:</b> "+la.feature.properties.Mat_Creche_Per+'</br>'+
				"<b>% pre-escola:</b> "+la.feature.properties.Mat_Pre_Esc_Per)
		});
		*/

		layer.addTo(map);		
		layer.setStyle(styleMap);
		
		
		
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

	const pipsSlider = document.getElementById('slider-pips');
	
	const promise = new Promise(function(resolve, reject) {
		const municipalities = $.get({url: "/geojson", dataType:"json", success: function(polygons){}});
		const mpdata = $.get({url: "/mpdata", dataType:"json", success: function(mpdata){}});
		$.when( municipalities, mpdata ).done(function (polygons, mpdata) {
			mpData = mpdata[0]
			feature = polygons[0].features.filter(getFeature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );
			resolve();	
		});
	});

	promise.then(function() {

		//console.log(mpData, feature)

		let mymap = initMap(feature);		
		componentMaker(mymap)

	})
	
});