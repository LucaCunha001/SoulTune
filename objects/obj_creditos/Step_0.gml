
if (debug) {
    if (keyboard_check_pressed(vk_f3)) {
		var song1 = scr_getmusicindex(global.music_index[1], global.music_index[0]);
        music_set_track_position(song1, (global.current_music_time + measure_time) / global.music_duration);
	}
}

if (credits_con == 0) {
	if (credit_index < array_length(creditos_names)) {
		if (global.is_playing) {
			var track_progress = global.current_music_time;
			if (track_progress >= measure_timer) {
				var measure_progress = track_progress / measure_time;
				credit_index = max(0, floor(measure_progress) - 1);
			}
		}
	} else {
		credits_con = 1;
		glowing_active = true;
	}
}

if (glowing_active) {
	if (global.is_playing) {
		var track_progress = global.current_music_time;

		if (track_progress >= auto_text_start) {
			if (!instance_exists(obj_writer)) {
				if (glowing_index < array_length(glowing_text)) {
					dequeue_text();
				}
			}
		}

		if (track_progress >= auto_text_stop) {
			with (obj_writer) forcebutton1 = 1;
		}

		with (obj_writer) skippable = 0;
	} else if alarm[0] <= 0 {
		alarm[0] = 100;
	}
}
