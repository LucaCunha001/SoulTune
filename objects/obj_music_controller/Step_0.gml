var btn_y = menu_y + 60;
var btn_w = 30;
var btn_h = 30;
var btn_x = menu_x + layout_width/2 - btn_w - 5;
var is_hover_play = point_in_rectangle(mouse_x, mouse_y, btn_x - 10, btn_y - 10, btn_x + btn_w + 10, btn_y + btn_h + 10);

if (is_hover_play && mouse_check_button_pressed(mb_left)) {
	if (global.music_index[1] != -1) {
		global.is_playing = !global.is_playing;
		if (global.is_playing) {
			var snd = global.primeiro_de_abril ? musica_primeiro_abril(global.music_index[1], global.music_index[0]) : scr_getmusicindex(global.music_index[1], global.music_index[0]);
			global.current_music_time = (global.current_music_time == global.music_duration ? 0 : global.current_music_time)
			audio_play_sound(snd, 1, false, global.volume, global.current_music_time);
			audio_sound_select(snd_select);
		} else {
			audio_stop_all();
		}
		global.discord_initialized = false;
	}
}

if (global.music_index[0] != -1) {	
	if (global.is_playing) {
		progress = global.current_music_time / global.music_duration;
	}

	if (global.is_playing && mouse_check_button(mb_left)) {
		if (point_in_rectangle(mouse_x, mouse_y, bar_x, bar_y, bar_x + bar_w, bar_y + bar_h)) {
			var snd = global.primeiro_de_abril ? musica_primeiro_abril(global.music_index[1], global.music_index[0]) : scr_getmusicindex(global.music_index[1], global.music_index[0]);
			progress = clamp((mouse_x - bar_x) / bar_w, 0, 1);
			music_set_track_position(snd, progress)
			global.discord_initialized = false;
		}
	}
}