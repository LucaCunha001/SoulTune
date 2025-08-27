for (var i = 0; i < struct_names_count(global.playlists); i++) {
	var x1 = menu_x;
	var y1 = menu_y + i * (btn_height + btn_spacing) + scroll_y;

	var offset_y = 0;
	var extra_h  = 0;

	if (point_in_rectangle(mouse_x, mouse_y, x1, y1 + offset_y, x1 + btn_width, y1 + btn_height + extra_h + offset_y)) {
		hovered_btn = i;

		if (!tocou_som) {
			tocou_som = true;
			audio_sound_select(snd_squeak);
		}

		if (mouse_check_button_pressed(mb_left)) {
			selected_music = i;
			
			global.playlist = playlist_chaves[i];
			
			audio_sound_select(snd_select);
			
			instance_create_depth(0, 0, depth, obj_playlist);
			instance_destroy();
		}
	}
}