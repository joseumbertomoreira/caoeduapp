$(document).ready(function() {

	let feature;
	let mpData;
	let layer = L.geoJson(); 

	const variables = {
		'% matricula creche': 'Mat_Creche_Per',
		'% matricula pre-escola': 'Mat_Pre_Esc_Per'
	}

	function getFeature(feature){
		return feature
	}



	function addLegend(map){
    var legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {
		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		        labels = [];

		    div.innerHTML =
		    '<i style="background:#0000FF";></i><span style="font-weight: 600;">Indefinido</span><br>' +
        '<i style="background:#ff0000";></i><span style="font-weight: 600;">0%~22%</span><br>' +
        '<i style="background:#ffa500";></i><span style="font-weight: 600;">22%~53%</span><br>' +
        '<i style="background:#ffff00";></i><span style="font-weight: 600;">53%~72%</span><br>' +
        '<i style="background:#caff70";></i><span style="font-weight: 600;">72%~92%</span><br>' +
        '<i style="background:#006400";></i><span style="font-weight: 600;">Maior 92%</span><br>'

        //div.info.background = "#E8E8E8"

		    return div;
		};
		legend.addTo(map);
	}



	function sliderPipDynamics(){

		var pips = pipsSlider.querySelectorAll('.noUi-value');

		function clickOnPip ( ) {
		    var value = Number(this.getAttribute('data-value'));
		    pipsSlider.noUiSlider.set(value);

		}

		for ( var i = 0; i < pips.length; i++ ) {
	    pips[i].style.cursor = 'pointer';
	    pips[i].addEventListener('click', clickOnPip);
		}

	}

	function getYear(list, year){

		if(list === undefined)
			return -1
		for(let i = 0; i < list.length; i++){
			if(list[i].Ano == year)
				return list[i]
		}
	}

	function styleMap(feat){
		let value = $( "#variable option:selected" ).text()
		let year = pipsSlider.noUiSlider.get();
		let aggregateDataByyear = getYear(mpData[feat.properties.Nome], year);

		if(aggregateDataByyear === -1){
			return {
	        color: "#0000FF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#0000ff"
	    	};
		}

		if(mpData[feat.properties.Nome] !== undefined){
			
			if(aggregateDataByyear[variables[value]] >= 92){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#006400"
	    	};
			} 
			else if(aggregateDataByyear[variables[value]] < 92 && aggregateDataByyear[variables[value]] >= 72){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#caff70"
	    	};
			}
			else if(aggregateDataByyear[variables[value]] < 72 && aggregateDataByyear[variables[value]] >= 53){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#ffff00"
	    	};
	    }
  		else if(aggregateDataByyear[variables[value]] < 53 && aggregateDataByyear[variables[value]] >= 22){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#ffa500"
	    	};
	    }
	    else if(aggregateDataByyear[variables[value]] < 22 && aggregateDataByyear[variables[value]] >= 0){
				return {
	        color: "#FFFFFF",
	        opacity: 0.2,
	        weight: 2,
	        fillOpacity: 0.7,
	        fillColor: "#ff0000"
	    	};
			}		
		}
	}

	function getYearFromMun(list){
		console.log(list);
		let years = [];
		for(let i = 0; i < list.length; i++){
			years.push(list[i].Ano)
		}
		return years

	}

	function getCreche(list){
		let creche = [];
		for(let i = 0; i < list.length; i++){
			creche.push(list[i].Mat_Creche_Per)
		}
		return creche		
	}

	function getPreEscola(list){
		let preEscola = [];
		for(let i = 0; i < list.length; i++){
			preEscola.push(list[i].Mat_Pre_Esc_Per)
		}
		return preEscola		
	}

	function chartMaker(){
		let municipalitie = $( "#municipality" ).val();
		//let variableValues = Object.values(variables);
		let years = getYearFromMun(mpData[municipalitie])
		let creche = getCreche(mpData[municipalitie])
		let preEscola = getPreEscola(mpData[municipalitie])
		
		var trace1 = {
		  x: years, 
		  y: creche, 
		  type: 'scatter',
		  name: '% creche'
		};
		var trace2 = {
		  x: years,
		  y: preEscola, 
		  type: 'scatter',
		  name: '% Pre-escola'
		};
		var layout = {
	    title: municipalitie,
	    showlegend: false
		};
		var data = [trace1, trace2];
		Plotly.newPlot('myDiv', data, layout, {displayModeBar: false});
		
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

		layer.addData(feature);

		
		layer.eachLayer(function (la) {
			let year = pipsSlider.noUiSlider.get();
			let value = $( "#variable option:selected" ).text()
			let aggregateDataByyear = getYear(mpData[la.feature.properties.Nome], year);
			la.bindPopup("<b>Ano:</b> "+aggregateDataByyear.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% Valor:</b> "+aggregateDataByyear[variables[value]]+'</br>')
		});		

		layer.addTo(map);		
		layer.setStyle(styleMap);		
		
	}

	function setLayer(map){
		layer.eachLayer(function (la) {

			let year = Math.floor(pipsSlider.noUiSlider.get());			 
			let value = $( "#variable option:selected" ).text()
			let aggregateDataByyear = getYear(mpData[la.feature.properties.Nome], year);
			la.bindPopup("<b>Ano:</b> "+aggregateDataByyear.Ano+'</br>'+
				"<b>Municipio:</b> "+la.feature.properties.Nome+'</br>'+
				"<b>% Valor:</b> "+aggregateDataByyear[variables[value]]+'</br>')
		});
		layer.setStyle(styleMap)
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

		let mymap = initMap(feature);		
		componentMaker(mymap)
		addLegend(mymap)
		chartMaker()
		return mymap

	}).then(function(mymap){
		let municipalitie = $( "#municipality" ).val();
		console.log(municipalitie)
		$("#variable").change(function(){ 	
	  	setLayer(mymap);
	  })
		
		$('#slider-pips').slider({
    	change: function(event, ui) { 
      	setLayer(mymap)
	    } 
		})

		$("#municipality").autocomplete({
	    source: Object.keys(mpData),
	    select: function( event, ui ) {
		    chartMaker()
	    }
	  })

	  $( "#zoomin" ).click(function() {

	  	let municipalitie = $( "#municipality" ).val();	  	
	  	layer.eachLayer(function (lay) {
			  if(lay.feature.properties.Nome === municipalitie){
			  	mymap.fitBounds(lay.getBounds());
			  }
			});

		});

		$( "#zoomout" ).click(function() {
	  	let municipalitie = $( "#municipality" ).val();
	  	
	  	mymap.setView([-16.361508, -49.500561], 6.49);
		});

	})
	
});