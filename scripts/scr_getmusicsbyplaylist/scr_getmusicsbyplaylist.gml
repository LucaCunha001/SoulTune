/// @function scr_getmusicsbyplaylist(name)
/// @description Retorna a lista de músicas de uma playlist pelo nome.
/// @param {string} name Nome da playlist.
/// @return {array<array<real>>} Retorna a playlist como array 2D de números, ou undefined se não existir.

function scr_getmusicsbyplaylist(argument0) {
	var playlist_nome = argument0;
	var playlist = struct_get(global.playlists, playlist_nome);
	return playlist;
}