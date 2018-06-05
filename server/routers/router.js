module.exports = function(app) {

  var controller = app.controllers.controller;

  app.get('/geojson', controller.geojson);
  app.get('/musjson', controller.schoolardata);

};