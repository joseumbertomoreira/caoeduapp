var XLSX = require('xlsx');
module.exports = function(app) {
  
  var routerInsert = {}

  routerInsert.insert = function(context, next){

  	app.post('/upload', function(req, res){
      res.sendStatus(200)
  		attachment = req.body.data
  		var xlsx = XLSX.read(attachment.replace(/_/g, "/").replace(/-/g, "+"), {type: 'base64'});
  		xlsx = XLSX.utils.sheet_to_json(xlsx.Sheets.Base)
      
      app.middleware.repository.insertData(xlsx)

  	});
  }
  
  return routerInsert;

};