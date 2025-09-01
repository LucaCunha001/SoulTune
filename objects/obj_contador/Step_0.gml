if (global.is_playing) {
	if (audio_exists(global.index_musica_atual)) {
		global.current_music_time = audio_sound_get_track_position(global.index_musica_atual);
	} else {
		global.current_music_time = -1;
	}
	
	atualizou = false;

	if (global.current_music_time >= global.music_duration || global.current_music_time < 0) {
		if (global.is_looping) {
			global.current_music_time = 0;
			tocar_musica(global.music_index[1], global.music_index[0], true);
		} else {
			global.current_music_time = global.music_duration;
			global.is_playing = false;
		}

		global.discord_initialized = false;
	}
} else {
	if (!atualizou) {
		global.discord_initialized = false;
		atualizou = true;
	}
}