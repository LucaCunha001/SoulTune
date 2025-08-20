if (global.is_playing) {
	var now = current_time;
	var delta = (now - last_time) / 1000; 
	last_time = now;

	global.current_music_time += delta;
	atualizou = false;
		
	if (global.current_music_time > global.music_duration) {
		if (global.is_looping) {
			global.current_music_time = 0;
			audio_stop_all();
			var snd = global.primeiro_de_abril ? musica_primeiro_abril(global.music_index[1], global.music_index[0]) : scr_getmusicindex(global.music_index[1], global.music_index[0]);
			audio_play_sound(snd, 1, false);
		} else {
			global.current_music_time = global.music_duration;
			global.is_playing = false;
		}
		
		global.discord_initialized = false;
	}
} else {
	last_time = current_time;
	if not (atualizou) {
		global.discord_initialized = false;
		atualizou = true;
	}
}