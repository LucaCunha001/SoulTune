languages = ["pt-br", "en-us"];
language_index = 0;

for (var i = 0; i<array_length(languages); i++) {
	if (global.language == languages[i]) {
		language_index = i;
		break;
	}
}

settings_buttons = [
	scr_gettext("obj_config_idioma") + ": " + scr_gettext("idioma"),
	scr_gettext("obj_config_background") + ": " +  scr_gettext("obj_config_background" + string(global.background_index+1)),
	scr_gettext("obj_config_sons") + ": " + (global.tocar_som ? scr_gettext("obj_config_ligado") : scr_gettext("obj_config_desligado")),
	scr_gettext("obj_config_init_fullscreen") + ": " + (global.init_fullscreen ? scr_gettext("obj_config_ligado") : scr_gettext("obj_config_desligado"))
];

settings_actions = [
	"language",
	"background",
	"sound",
	"fullscreen"
];

if (os_type == os_android) {
	array_pop(settings_buttons);
	array_pop(settings_actions);
}

btn_spacing = 30;
btn_width = 180;
btn_height = 25;

btn_back_w = 65;
btn_back_h = 25;
btn_back_x = 20;
btn_back_y = room_height - btn_back_h - 20;

total = array_length(settings_buttons);
half = ceil(total / 2);

total_h = (half) * (btn_height + btn_spacing);
base_y = (room_height - total_h) / 2;

slider_w = 180;
slider_h = 10;
slider_x = (room_width - slider_w)/2;
slider_y = base_y + total_h + btn_spacing;

slider_handle_r = 10;
slider_dragging = false;

btn_repo_w = 100;
btn_repo_h = 25;
btn_repo_x = room_width - btn_repo_w - 20;
btn_repo_y = room_height - btn_repo_h - 20;

repo_url = "https://github.com/LucaCunha001/SoulTune/releases/latest/";

hovered_btn = -1;
hover_sound_played = false;
clicking = false;

col_spacing = 60;
x_left  = room_width/2 - (btn_width + col_spacing/2);
x_right = room_width/2 + (col_spacing/2);