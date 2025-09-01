hovered_lateral = -1;
for (var j = 0; j < array_length(lateral_buttons); j++) {
	var b = lateral_buttons[j];
	if (point_in_rectangle(mouse_x, mouse_y, b.x, b.y, b.x + b.w, b.y + b.h)) {
		hovered_lateral = j;
		if (!tocou_som) {
			tocou_som = true;
			audio_sound_select(snd_squeak);
		}
		if (mouse_check_button_pressed(mb_left)) {
			audio_sound_select(snd_select);
			switch(j) {
				case 0: // Criar
					global.playlist = scr_gettext("obj_playlist_selector_np");
					
					struct_set(global.playlists, global.playlist, []);
					playlist_chaves = struct_get_names(global.playlists);
					save_playlists();
					
					break;
				case 1:
					modo = "editar";
					break;
				case 2:
					modo = "deletar";
					break;
				case 3:
					instance_create_depth(0, 0, depth, obj_music_selector);
					instance_destroy();
					break;
			}
		}
	}
}

if (hovered_lateral == -1 && hovered_btn == -1) tocou_som = false;

hovered_btn = -1;
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
			switch (modo) {
				case "abrir":
					selected_music = i;
					global.playlist = playlist_chaves[i];
					audio_sound_select(snd_select);
					instance_create_depth(0, 0, depth, obj_playlist);
					instance_destroy();
					break;
				case "editar":
					global.playlist = playlist_chaves[i];
					instance_create_depth(0, 0, depth, obj_editar_playlist);
					instance_destroy();
					modo = "abrir";
					break;
				case "deletar":
					struct_remove(global.playlists, playlist_chaves[i]);
					playlist_chaves = struct_get_names(global.playlists);
					save_playlists();
					modo = "abrir";
					break;
			}
		}
	}
}