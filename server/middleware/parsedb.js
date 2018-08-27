 


module.exports = {

  parse: function(dbobject) {
  	let cidades = {};
    for(let i = 0; i < dbobject.length; i++){
    	cidades[dbobject[i].Municipio.slice(0,-1)] = [];
    }
    console.log(cidades);
  }

};