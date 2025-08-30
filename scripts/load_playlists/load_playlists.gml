/// @function scr_load_playlists()
/// @description Carrega playlists do arquivo playlists.json para global.playlists no formato esperado.
<<<<<<< HEAD
/// @return {struct<array<array<real>>>, undefined}

function load_playlists() {
	var data = scr_openjson_struct("playlists.json");
	
	if (is_undefined(data)) {
		global.playlists = {};
		return undefined;
	}
	
	global.playlists = data;
	return global.playlists;
=======
/// @return {undefined, Array<Struct>, Array}
function load_playlists() {
	var data = scr_openjson("playlists.json");
	if (data == undefined || !ds_exists(data, ds_type_list)) {
		data = ds_list_create();
		global.playlists = [];
		save_playlists();
		return [];
	}

	var playlists = [];

	for (var i = 0; i < ds_list_size(data); i++) {
		var pl_map = ds_list_find_value(data, i);
		var nome = ds_map_find_value(pl_map, "nome");
		var musicas_dslist = ds_map_find_value(pl_map, "musicas");

		var musicas_array = ds_list_create();
		for (var j = 0; j < ds_list_size(musicas_dslist); j++) {
			var cap_index = ds_list_find_value(musicas_dslist, j);
			var cap_index_copy = ds_list_create();
			ds_list_add(cap_index_copy, ds_list_find_value(cap_index, 0));
			ds_list_add(cap_index_copy, ds_list_find_value(cap_index, 1));
			ds_list_add(musicas_array, cap_index_copy);
		}

		array_push(playlists, {nome: nome, musicas: musicas_array});
	}

	global.playlists = playlists;
	return playlists;
>>>>>>> origin/main
}