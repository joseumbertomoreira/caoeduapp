//https://refreshless.com/nouislider/

$(document).ready(function() {

	function getFeature(feature){
		return feature
	}

	function sliderPipDynamics(){

		var pips = pipsSlider.querySelectorAll('.noUi-value');

		function clickOnPip ( ) {
		    var value = Number(this.getAttribute('data-value'));
		    console.log(value);
		    pipsSlider.noUiSlider.set(value);

		}

		for ( var i = 0; i < pips.length; i++ ) {
	    // For this example. Do this in CSS!
	    pips[i].style.cursor = 'pointer';
	    pips[i].addEventListener('click', clickOnPip);
		}

	}

	function popUpMaker(la, mpdata){

	}

	function componentMaker(polygons, mpdata){
		let years = []
		let municipalitie = polygons[0].properties.Nome;
		let filtredMpData = mpdata[municipalitie];

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

	}

	function poligonMap(feature, mpdata){
		
		let layer = L.geoJson();

		layer.addData(feature);

		layer.eachLayer(function (la) {
			console.log(la.feature.properties.Nome);
			//get value from slider
			/*
			la.bindPopup("<b>Ano:</b> "+la.feature.properties.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% creche:</b> "+la.feature.properties.Mat_Creche_Per+'</br>'+
				"<b>% pre-escola:</b> "+la.feature.properties.Mat_Pre_Esc_Per)
			*/
		});
		/*
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

	const pipsSlider = document.getElementById('slider-pips');

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
		componentMaker(ajax[0], ajax[1])
		poligonMap(ajax[0], ajax[1])

	})

});