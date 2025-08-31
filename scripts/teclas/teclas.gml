/// @function teclas()
/// @description Ativa fullscreen ou navegação com backspace.

function teclas() {
	if (keyboard_check_pressed(vk_f4)) {
		window_set_fullscreen(!window_get_fullscreen());
		window_center();
	}

	if (keyboard_check_pressed(vk_backspace) && !instance_exists(obj_inputbox)) {
		var objeto_destino = obj_main_menu;

		var primary_instances = [obj_music_selector, obj_chapter_select, obj_config];
		var playlist_instances = [obj_music_selector, obj_playlists_select, obj_playlist, obj_editar_playlist];

		if (instance_exists(obj_music_selector) || instance_exists(obj_chapter_select) || instance_exists(obj_config)) {
			if (global.deltarune_cap != 0 && !instance_exists(obj_chapter_select) && !instance_exists(obj_config)) {
				objeto_destino = obj_chapter_select;
			}
			for (var i = 0; i < array_length(primary_instances); i++) {
				if (instance_exists(primary_instances[i])) instance_destroy(primary_instances[i]);
			}
		}

		else if (instance_exists(obj_music) && !instance_exists(obj_playlist)) {
			instance_destroy(obj_music);
			instance_destroy(obj_music_controller);
			objeto_destino = obj_music_selector;
		}

		else if (instance_exists(obj_editar_playlist) || instance_exists(obj_playlist) || instance_exists(obj_playlists_select)) {
			for (var i = 0; i < array_length(playlist_instances); i++) {
				if (instance_exists(playlist_instances[i])) {
					objeto_destino = playlist_instances[max(0, i-1)];
				}
			}
			for (var i = 0; i < array_length(playlist_instances); i++) {
				if (instance_exists(playlist_instances[i])) instance_destroy(playlist_instances[i]);
			}
			if (instance_exists(obj_music_controller)) instance_destroy(obj_music_controller);
		}

		if (instance_exists(obj_creditos)) {
			instance_create_depth(0, 0, depth, obj_background);
			instance_create_depth(0, 0, depth-1, obj_config);
			audio_stop_all();
			tocar_musica(obj_creditos.music_index[1], obj_creditos.music_index[0], obj_creditos.is_looping);
			instance_destroy(obj_writer);
			instance_destroy(obj_creditos);
			return;
		}

		if (!instance_exists(obj_intro)) {
			instance_create_depth(0, 0, depth-1, objeto_destino);
		}
	}
}