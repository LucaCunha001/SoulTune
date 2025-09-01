var btn_y = menu_y + 60;
var btn_w = 30;
var btn_h = 30;
var btn_x = menu_x + layout_width/2 - btn_w - 5;
var is_hover_play = point_in_rectangle(mouse_x, mouse_y, btn_x - 10, btn_y - 10, btn_x + btn_w + 10, btn_y + btn_h + 10);

if (is_hover_play && mouse_check_button_pressed(mb_left)) {
	if (global.music_index[1] != -1) {
		global.is_playing = !global.is_playing;
		if (global.is_playing) {
			var tempo_atual = global.current_music_time;
			tocar_musica(global.music_index[1], global.music_index[0], global.is_looping);
			if (tempo_atual < global.music_duration) {
				audio_sound_set_track_position(global.index_musica_atual, tempo_atual);
				global.current_music_time = tempo_atual;
			}
			audio_sound_select(snd_select);
		} else {
			audio_stop_all();
		}
		global.discord_initialized = false;
	}
}

if (global.music_index[0] != -1) {
	if (mouse_check_button_pressed(mb_left)) {
		if (point_in_rectangle(mouse_x, mouse_y, bar_x, bar_y, bar_x + bar_w, bar_y + bar_h)) {
			touching_bar = true;
		}
	}

	if (mouse_check_button(mb_left) && touching_bar) {
		is_looping = global.is_looping;
		global.is_playing = false;
		audio_stop_all();
		progress = clamp((mouse_x - bar_x) / bar_w, 0, 1);
	}

	if (mouse_check_button_released(mb_left) && touching_bar) {
		tocar_musica(global.music_index[1], global.music_index[0], is_looping);
		audio_sound_set_track_position(global.index_musica_atual, progress * global.music_duration);
		touching_bar = false;
		global.discord_initialized = false;
	}
	
	if (global.is_playing) {
		global.current_music_time = audio_sound_get_track_position(global.index_musica_atual);
		progress = global.current_music_time / global.music_duration;
	}
}
