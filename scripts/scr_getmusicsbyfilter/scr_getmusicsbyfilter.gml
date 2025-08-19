/// @function scr_getmusicbyfilter(filtro)
/// @description Retorna uma lista das músicas filtradas
/// @param {string} filtro Nome do filtro
/// @return {Id.DsList<Real>, Undefined}

function scr_getmusicsbyfilter(argument0) {

	var filtro_nome = argument0;
	if (global.language != "pt-br") {
		var lutas_txt = string_lower(scr_gettext("obj_music_selector_img_lutas"));
		var fundo_txt = string_lower(scr_gettext("obj_music_selector_img_fundo"));
		var cutscenes_txt = string_lower(scr_gettext("obj_music_selector_img_cutscenes"));
		var todas_txt = string_lower(scr_gettext("obj_music_selector_img_todas"));

		switch (argument0) {
			case lutas_txt:
				filtro_nome = "lutas";
				break;
			case fundo_txt:
				filtro_nome = "fundo";
				break;
			case cutscenes_txt:
				filtro_nome = "cutscenes";
				break;
			case todas_txt:
				filtro_nome = "todas";
				break;
		}
	}

	var lista_filtrada = ds_list_create();
	if (filtro_nome == "todas") {		
		var indices = ds_map_find_value(global.folder, "indices");
		for (var i = 0; i < ds_list_size(indices); i++) {
			ds_list_add(lista_filtrada, i+1);
		}
		return lista_filtrada;
	}
	
	if (!ds_map_exists(global.filtros, filtro_nome)) {
		show_debug_message("Filtro não encontrado: " + string(filtro_nome));
		return lista_filtrada;
	}

	var filtro = ds_map_find_value(global.filtros, filtro_nome);

	if (ds_list_size(filtro) == 0) {
		show_debug_message("Filtro vazio: " + filtro_nome);
		return lista_filtrada;
	}

	var inner_list = ds_list_find_value(filtro, global.deltarune_cap);

	if (inner_list == undefined) {
		show_debug_message("Filtro vazio: " + filtro_nome);
		return lista_filtrada;
	}

	for (var i = 0; i < ds_list_size(inner_list); i++) {
		var idx = int64(ds_list_find_value(inner_list, i));
		ds_list_add(lista_filtrada, idx);
	}

	return lista_filtrada;
}