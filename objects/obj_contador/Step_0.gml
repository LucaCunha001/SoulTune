if (global.is_playing) {
	atualizou = false;

	if (audio_exists(global.index_musica_atual)) {
		global.current_music_time = audio_sound_get_track_position(global.index_musica_atual);
	} else {
		global.current_music_time = -1;
	}

	if (global.current_music_time >= global.music_duration || global.current_music_time < 0) {
		if (global.is_looping) {
			global.current_music_time = 0;
			tocar_musica(global.music_index[1], global.music_index[0], true);
		} else {
			global.current_music_time = global.music_duration;
			global.is_playing = false;
			if (string_length(global.playlist) > 0) {
				var musics = scr_getmusicsbyplaylist(global.playlist_atual);
				load_playlists();
				
				global.playlist_music_index++;

				if (global.playlist_music_index >= array_length(musics)) {
					global.playlist_music_index = 0;
				}

				var next = musics[global.playlist_music_index];
				var cap = next[0];
				var idx = next[1];

				tocar_musica(idx, cap, global.is_looping);
				global.is_playing = true;
			}
		}

		global.discord_initialized = false;
	}
} else {
	if (!atualizou) {
		global.discord_initialized = false;
		atualizou = true;
	}
}