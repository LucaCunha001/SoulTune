hovered_btn = -1;
var hovered_back = point_in_rectangle(mouse_x, mouse_y, btn_back_x, btn_back_y, btn_back_x + btn_back_w, btn_back_y + btn_back_h);
var hovered_repo = point_in_rectangle(mouse_x, mouse_y, btn_repo_x, btn_repo_y, btn_repo_x + btn_repo_w, btn_repo_y + btn_repo_h);

for (var i = 0; i < total; i++) {
	var col = i mod 2;
	var row = floor(i / 2);

	var x1 = (col == 0) ? x_left : x_right;
	var y1 = base_y + row * (btn_height + btn_spacing);

	if (total mod 2 == 1 && i == total - 1) {
		x1 = (room_width - btn_width)/2;
	}

	if (point_in_rectangle(mouse_x, mouse_y, x1, y1, x1 + btn_width, y1 + btn_height)) {
		hovered_btn = i;
		break;
	}
}

if ((hovered_btn != -1 || hovered_back || hovered_repo) && !hover_sound_played) {
	audio_sound_select(snd_squeak);
	hover_sound_played = true;
}
if (hovered_btn == -1 && !hovered_back && !hovered_repo) {
	hover_sound_played = false;
}

if (mouse_check_button_pressed(mb_left) && !clicking) {
	clicking = true;
	if (hovered_btn != -1) {
		switch(settings_actions[hovered_btn]) {
			case "language":
				language_index = (language_index + 1) mod array_length(languages);
				global.language = languages[language_index];
				__init_load_osts();
								
				global.discord_initialized = false;
				
				settings_buttons[hovered_btn] = scr_gettext("obj_config_idioma") + ": " + scr_gettext("idioma");
				settings_buttons[1] = scr_gettext("obj_config_background") + ": " + scr_gettext("obj_config_background" + string(global.background_index+1));
				settings_buttons[2] = scr_gettext("obj_config_sons") + ": " + (global.tocar_som ? scr_gettext("obj_config_ligado") : scr_gettext("obj_config_desligado"));
				
				break;

			case "background":
				global.background_index = (global.background_index + 1) mod array_length(global.backgrounds);
				settings_buttons[hovered_btn] = scr_gettext("obj_config_background") + ": " + scr_gettext("obj_config_background" + string(global.background_index+1));
				break;
				
			case "sound":
				global.tocar_som = !global.tocar_som;
				settings_buttons[hovered_btn] = scr_gettext("obj_config_sons") + ": " + (global.tocar_som ? scr_gettext("obj_config_ligado") : scr_gettext("obj_config_desligado"));
				break;
			
			case "fullscreen":
				global.init_fullscreen = !global.init_fullscreen;
				settings_buttons[hovered_btn] = scr_gettext("obj_config_init_fullscreen") + ": " + (global.init_fullscreen ? scr_gettext("obj_config_ligado") : scr_gettext("obj_config_desligado"));
				break;

		}
		audio_sound_select(snd_select);

		save_user_options();
	}
	else if (hovered_back) {
		audio_sound_select(snd_select);
		instance_create_depth(0, 0, depth, obj_main_menu);
		instance_destroy();
	}
	else if (hovered_repo) {
		audio_sound_select(snd_select);
		url_open(repo_url);
	}

	alarm[0] = 5;
}

var handle_x = slider_x + global.volume * slider_w;
var handle_y = slider_y + slider_h/2;

if (mouse_check_button_pressed(mb_left)) {
	if (point_in_circle(mouse_x, mouse_y, handle_x, handle_y, slider_handle_r)) {
		slider_dragging = true;
	}
}

if (mouse_check_button(mb_left) && slider_dragging) {
	var rel = clamp((mouse_x - slider_x) / slider_w, 0, 1);
	global.volume = rel;
	audio_master_gain(global.volume);
	save_user_options();
}

if (mouse_check_button_released(mb_left)) {
	slider_dragging = false;
	save_user_options();
}