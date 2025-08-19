/// @function tocar_musica
/// @description Toca uma música.
/// @param {real} index O índex da música.
/// @param {real} capitulo O capítulo correspondente ao índex.
/// @param {bool} loop A música está em loop?

function tocar_musica(argument0, argument1, argument2) {
	var snd = scr_getmusicindex(argument0, argument1);
	audio_stop_all();
	audio_play_sound(snd, 1, argument2);
	global.music_duration = audio_sound_length(snd);

	global.is_playing = true;

	global.music_index = [argument1, argument0];
	global.current_music_time = 0;

	global.musica_atual = scr_getmusicname(argument0, argument1);
	global.discord_initialized = false;

	android_update_servicename(global.musica_atual);
}