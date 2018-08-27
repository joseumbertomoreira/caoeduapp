 


module.exports = {

  parse: function(dbobject) {
  	let cities = {};

    for(let i = 0; i < dbobject.length; i++){
    	cities[dbobject[i].Municipio.slice(0,-1)] = [];
    }

    for(let i = 0; i < dbobject.length; i++){
    	
    	if( cities[dbobject[i].Municipio.slice(0,-1)] ){
    		cities[dbobject[i].Municipio.slice(0,-1)].push({
    			Cod_Munic: dbobject[i].Cod_Munic,
			    Cod_Munic2: dbobject[i].Cod_Munic2,
			    Ano: dbobject[i].Ano,
			    Pop_0_3: dbobject[i].Pop_0_3,
			    Pop_4_5: dbobject[i].Pop_4_5,
			    Taxa_Cres: dbobject[i].Taxa_Cres,
			    Mat_Creche_Nun: dbobject[i].Mat_Creche_Nun,
			    Mat_Creche_Per: dbobject[i].Mat_Creche_Per,
			    Mat_Pre_Esc_Nun: dbobject[i].Mat_Pre_Esc_Nun,
			    Mat_Pre_Esc_Per: dbobject[i].Mat_Pre_Esc_Per
    		})
    	}    	    	
    }

    return cities;
    
  }

};