module.exports = {

	transporte: function(){
		let transporteQuery = "select MUNICIPIO, P_APROV, P_REPROV from Dados_Historicos_Transporte_Escolar"
		return transporteQuery
	},

	escolar: function(){
		let escolarQuery = 'SELECT Municipios.Municipio,\
                   SchoolarData.Cod_Munic,\
                    SchoolarData.Cod_Munic2,\
                     SchoolarData.Ano, SchoolarData.Pop_0_3,\
                      SchoolarData.Pop_4_5,\
                       SchoolarData.Taxa_Cres,\
                        SchoolarData.Mat_Creche_Nun,\
                         SchoolarData.Mat_Creche_Per,\
                          SchoolarData.Mat_Pre_Esc_Nun,\
                           SchoolarData.Mat_Pre_Esc_Per\
                            FROM Municipios JOIN SchoolarData\
                             ON Municipios.Cod_Munic = SchoolarData.Cod_Munic\
                              ORDER BY SchoolarData.Ano DESC'

    return escolarQuery;

	}

}