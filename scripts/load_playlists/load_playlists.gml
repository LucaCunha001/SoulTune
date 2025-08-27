/// @function scr_load_playlists()
/// @description Carrega playlists do arquivo playlists.json para global.playlists no formato esperado.
/// @return {struct<array<array<real>>>, undefined}

function load_playlists() {
	var data = scr_openjson_struct("playlists.json");
	
	if (is_undefined(data)) {
		global.playlists = {};
		return undefined;
	}
	
	global.playlists = data;
	return global.playlists;
}