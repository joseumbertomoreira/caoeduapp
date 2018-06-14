module.exports = function(app) {
  
  var router = {}

  router.geojson = function(context, next){

  	app.get('/geojson', function(request, response){

  		response.send(context.municipios)

  	});	
  }
  
  return router;

};