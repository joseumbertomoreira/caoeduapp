module.exports = function(app){
	var repository = app.middleware.repository;


	var controller = {};

	controller.geojson = function(request, response){
		repository.db(function(schoolar){
			var geojson = repository.municipios()
			repository.mergeGeoJSONQuery(schoolar, geojson)
			response.send(repository.municipios());
		})
	}

	controller.schoolardata = function(request, response){
		repository.db(function(object){
			response.send(object);
		})
	}

	return controller;

}