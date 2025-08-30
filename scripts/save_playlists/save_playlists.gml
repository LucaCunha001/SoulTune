/// @function scr_save_playlists()
/// @description Salva global.playlists no arquivo playlists.json no formato JSON especificado.
function save_playlists() {
	scr_savejson("playlists.json", global.playlists);
}
