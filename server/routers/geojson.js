module.exports = function(app) {
  
  var routerGeo = {}

  routerGeo.geojson = function(context, next){

  	app.get('/geojson', function(request, response){

  		response.send(context.municipios)

  	});

  	app.post('/insertFile', function(request, response){

  		response.send(context.municipios)

  	});
  }
  
  return routerGeo;

};