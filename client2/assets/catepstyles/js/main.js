$(document).ready(function() {
	var promise = new Promise(function(resolve, reject) {
		var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){}});
		$.when( d1 ).done(function (geojson) {
			console.log(geojson);
		/*
			var feature = geojson.features.filter(getFeature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );
			console.log(feature)
			resolve(feature);	
		*/
		});
	});
});