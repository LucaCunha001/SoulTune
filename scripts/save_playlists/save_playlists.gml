/// @function scr_save_playlists()
/// @description Salva global.playlists no arquivo playlists.json no formato JSON especificado.
function save_playlists() {    
	var json_list = ds_list_create();

	for (var i = 0; i < array_length(global.playlists); i++) {
		var pl = global.playlists[i];

		var pl_map = ds_map_create();
		ds_map_add(pl_map, "nome", pl.nome);

		var musicas_list = ds_list_create();

		for (var j = 0; j < array_length(pl.musicas); j++) {
			var musica = pl.musicas[j];

			var cap_index_list = ds_list_create();
			ds_list_add(cap_index_list, musica[0]);
			ds_list_add(cap_index_list, musica[1]);

			ds_list_add(musicas_list, cap_index_list);
		}

		ds_map_add(pl_map, "musicas", musicas_list);
		ds_list_add(json_list, pl_map);
	}

	var json_text = (array_length(global.playlists) > 0) ? json_encode(json_list) : "[]";

	var file = file_text_open_write("playlists.json");
	file_text_write_string(file, json_text);
	file_text_close(file);

	// Limpeza
	for (var i = 0; i < ds_list_size(json_list); i++) {
		var pl_map = ds_list_find_value(json_list, i);
		var musicas_list = ds_map_find_value(pl_map, "musicas");

		for (var j = 0; j < ds_list_size(musicas_list); j++) {
			ds_list_destroy(ds_list_find_value(musicas_list, j));
		}
		ds_list_destroy(musicas_list);
		ds_map_destroy(pl_map);
	}
	ds_list_destroy(json_list);
}
