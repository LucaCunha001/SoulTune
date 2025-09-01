/// @function tocar_musica
/// @description Toca uma música.
/// @param {real} index O índice da música.
/// @param {real} capitulo O capítulo correspondente ao índice.
/// @param {bool} loop A música está em loop?

function tocar_musica(argument0, argument1, argument2) {
	var snd;
	var nome;
	
	audio_stop_all();

	if (global.primeiro_de_abril && !instance_exists(obj_creditos) && !instance_exists(obj_intro)) {
		snd = musica_primeiro_abril(argument0, argument1);
		if (snd == snd_abril) {
			nome = "666. DRIVING IN MY CAR";
		} else {
			nome = "-666. DRIVING IN MY TRUCK";
		}
		global.music_duration = ceil(audio_sound_length(snd));
	} else {
		snd = scr_getmusicindex(argument0, argument1);
		nome = scr_getmusicname(argument0, argument1);
		global.music_duration = audio_sound_length(snd);
	}

	var song = audio_play_sound(snd, 1, false);

	global.is_playing = true;
	global.is_looping = argument2;
	global.music_index = [argument1, argument0];
	global.current_music_time = 0;
	global.musica_atual = nome;
	global.discord_initialized = false;

	if (!instance_exists(obj_contador)) {
		instance_create_depth(0, 0, depth, obj_contador);
	}

	android_update_servicename(global.musica_atual);
	
	global.index_musica_atual = song;
	return global.index_musica_atual;
}