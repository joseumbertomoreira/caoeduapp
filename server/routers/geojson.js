module.exports = function(app) {
  
  var routerGeo = {}

  routerGeo.geojson = function(context, next){

  	app.get('/geojson', function(request, response){

  		response.send(context.municipios)

  	});

  	app.get('/mpdata', function(request, response){

  		response.send(context.mpdata)

  	});

    app.get('/transporte', function(request, response){

      response.send(context.transporte)

    });

  }
  
  return routerGeo;

};