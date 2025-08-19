/// @function scr_load_playlists()
/// @description Carrega playlists do arquivo playlists.json para global.playlists no formato esperado.
/// @return {undefined | Array<Struct>}
function load_playlists() {
	var data = scr_openjson("playlists.json");
	if (data == undefined) return undefined;

	var playlists = [];

	var size = ds_list_size(data);
	for (var i = 0; i < size; i++) {
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

	for (var i = 0; i < ds_list_size(data); i++) {
		var pl_map = ds_list_find_value(data, i);
		var musicas_dslist = ds_map_find_value(pl_map, "musicas");

		for (var j = 0; j < ds_list_size(musicas_dslist); j++) {
			ds_list_destroy(ds_list_find_value(musicas_dslist, j));
		}
		ds_list_destroy(musicas_dslist);
		ds_map_destroy(pl_map);
	}
	ds_list_destroy(data);

	global.playlists = playlists;
	return playlists;
}