$(document).ready(function() {
	/*
	function getFeature(feature){
		return feature
	}

	//dropbox com os anos de determinada cidade;
	function dropBoxYears(features){
		var select = $('#year');
		var countArray = [];
		$("#year option").remove();
		features.properties.schoolar.forEach(function(element, index){
			if(countArray.indexOf(element.Ano) === -1){
				countArray.push(element.Ano)
				select.append($("<option/>").val(index).text(element.Ano));
			}
		})
	}

	function asyncForEach(feature, callback){
		for (let index = 0; index < feature.length; index++) {
	    await callback(feature[index], index, feature)
	  }
	}

	async function forzao(){
		await asyncForEach(feature, async function(num){
	    console.log(num)
		})			
	}
	*/
	//gera o dropBox com o nome das cidades;
		/*
	async function dropBoxNameCities(feature){

		var promise = new Promise(resolve, reject){}
		
		forzao(feature);

		var select = $('#down');
		var countArray = [];
		count = 0;
		//iterando features para montar o dropbox com os nomes dos municipios
		feature.forEach(function(element, index){
			
			//if(index === 0)
				//dropBoxYears(element);

			if(countArray.indexOf(element.properties.Nome) == -1){
				countArray.push(element.properties.Nome)
				select.append($("<option/>").val(index).text(element.properties.Nome));
				if(countArray.length == 1){
					var mun = $( "#down option:selected" ).text();
					//tableGenerator(feature, mun);				
				}
			}

		})

	}
		*/	


	/*
	var promise = new Promise(function(resolve, reject) {
		var d1 = $.get({url: "/geojson", dataType:"json", success: function(geojson2){}});
		$.when( d1 ).done(function (geojson) {
			var feature = geojson.features.filter(getFeature);
			feature.sort(function(a,b) {return (a.properties.Nome > b.properties.Nome) ? 1 : ((b.properties.Nome > a.properties.Nome) ? -1 : 0);} );
			resolve(feature);	
		});
	});

	promise.then(function(feature) {
	  dropBoxNameCities(feature)
	  return feature;
	}).then(function(feature) {
	  //console.log(feature);
	})
	*/
});



/*
	const asyncForEach = (array, callback) => {
	  for (let index = 0; index < array.length; index++) {
	    callback(array[index], index, array);
	  }
	}

	const start = async () => {
	  await asyncForEach([1, 2, 3], async (num) => {
	    //await waitFor(50)
	    console.log(num)
	  })
	  console.log('Done')
	}

	start()


*/