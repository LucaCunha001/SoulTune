/// @function __init_load_osts()
/// @description Inicializa a lista global de pastas de OSTs carregando e processando o arquivo JSON "osts.json".
///   - Lê o JSON com `src_openjson`.
///   - Define `global.language_json` com base na linguagem global selecionada.
///   - Cria o array `global.folders`, onde cada elemento é um ds_map com:
///       * "path": string com o caminho da pasta de músicas.
///       * "indices": lista (ds_list) dos nomes dos arquivos de música.
/// @return {Undefined}

function __init_load_osts() {
	global.primeiro_de_abril = (current_day == 1 && current_month == 4);
	//global.primeiro_de_abril = true;
	
	var osts_json = scr_openjson("osts.json");

	var language_json = ds_map_find_value(ds_map_find_value(osts_json, "languages"), global.language);
	
	global.language_data = scr_openjson(language_json)
	
	global.filtros = ds_map_find_value(osts_json, "filtros");
	
	var folders_list_raw = ds_map_find_value(osts_json, "folders");
	var len = ds_list_size(folders_list_raw);

	global.folders = array_create(len);

	for (var i = 0; i < len; i++) {
		var folder_raw = folders_list_raw[| i];
		var folder_map = ds_map_create();
		
		var path = ds_map_find_value(folder_raw, "path");
		var indices_raw = ds_map_find_value(folder_raw, "indices");

		var indices_list = indices_raw;
		if (typeof(indices_raw) == ty_string) {
			indices_list = json_parse(string(indices_raw));
		} else {
			indices_list = indices_raw;
		}

		ds_map_add(folder_map, "path", path);
		ds_map_add(folder_map, "indices", indices_list);

		global.folders[i] = folder_map;
	}
}