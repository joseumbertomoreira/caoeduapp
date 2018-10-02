export default {
	geoJson: function(){
		return new Promise(function(resolve, reject){
			$.get({url: "/geojson", dataType:"json", success: function(polygons){
					console.log('poli',polygons)
					resolve(polygons)
				}
			})
		})
	}
}
