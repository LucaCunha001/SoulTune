/// @function fullscreen()
/// @description Ativa o fullscreen caso a tecla vk_f4 esteja pressionada. 

function outras_funcoes() {
	if (keyboard_check_pressed(vk_f4)) {
		var in_fullscreen = window_get_fullscreen();
		assistent_fullscreen(in_fullscreen);
		window_set_fullscreen(!in_fullscreen);
		assistent_fullscreen(!in_fullscreen);
	}
	
	if (keyboard_check_pressed(vk_backspace)) {
		var objeto_destino = obj_main_menu;

		if (instance_exists(obj_music_selector) || instance_exists(obj_chapter_select) || instance_exists(obj_config)) {
		
			if ((global.deltarune_cap != 0 && !instance_exists(obj_chapter_select)) && !instance_exists(obj_config)) {
				objeto_destino = obj_chapter_select;
			}

			instance_destroy(obj_music_selector);
			instance_destroy(obj_chapter_select);
			instance_destroy(obj_config);
		}

		else if (instance_exists(obj_playlists) || instance_exists(obj_music)) {
			instance_destroy(obj_music);
			instance_destroy(obj_playlists);
			instance_destroy(obj_music_controller);
			objeto_destino = obj_music_selector;
		}

		instance_create_depth(0, 0, depth-1, objeto_destino);
	}
}

function assistent_fullscreen(argument0) {
	if (!argument0) {
		var win_w = 960;
		var win_h = 520;
		window_set_size(win_w, win_h);
			
		var scr_w = display_get_width();
		var scr_h = display_get_height();
		
		window_set_position(
			(scr_w - win_w) div 2,
			(scr_h - win_h) div 2
		);
	}
}