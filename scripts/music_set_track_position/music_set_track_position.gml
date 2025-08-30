function music_set_track_position(snd, progress) {
	audio_stop_all();
	global.current_music_time = progress * global.music_duration;
	audio_play_sound(snd, 1, false, 1, global.current_music_time);
}