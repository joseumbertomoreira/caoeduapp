$(document).ready(function() {
	
	function getFeature(feature){
		return feature
	}

	const municipalities = $.get({url: "/geojson", dataType:"json", success: function(polygons){}});

	const mpdata = $.get({url: "/mpdata", dataType:"json", success: function(mpdata){}});

	const whenjax = $.when( municipalities, mpdata ).done(function (polygons, mpdata) {
		let mpData = mpdata[0]
		let feature = polygons[0].features.filter(getFeature);
		feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );		
		console.log(feature)
		return [feature,mpData]

	});

	export default { data: whenjax } 

})
