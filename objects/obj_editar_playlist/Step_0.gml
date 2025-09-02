hovered_btn = -1;

for (var i = 0; i < array_length(botoes); i++) {
	var b = botoes[i];
	if (point_in_rectangle(mouse_x, mouse_y, b.x, b.y, b.x+b.w, b.y+b.h)) {
		hovered_btn = i;
		if (!tocou_som) {
			tocou_som = true;
			audio_sound_select(snd_squeak);
		}
		if (mouse_check_button_pressed(mb_left)) {
			audio_sound_select(snd_select);
			b.callback();
		}
	}
}

if (remover_modo) {
	var y0 = 80;
	for (var j = 0; j < array_length(playlist_musicas); j++) {
		var mx = mouse_x;
		var my = mouse_y;
		var txt_y = y0 + j*20 + scroll_y;

		if (point_in_rectangle(mx, my, 200, txt_y-8, 400, txt_y+8)) {
			if (mouse_check_button_pressed(mb_left)) {
				array_delete(playlist_musicas, j, 1);
				struct_set(global.playlists, playlist_nome, playlist_musicas);
				save_playlists();

				remover_modo = false;
				break;
			}
		}
	}

	if (keyboard_check_pressed(vk_escape)) {
		remover_modo = false;
	}
}

if (hovered_btn == -1) tocou_som = false;

if (mouse_wheel_up())  scroll_y = min(scroll_y + scroll_speed, 0);
if (mouse_wheel_down()) scroll_y -= scroll_speed;

if (os_type != os_android) {
	if (device_mouse_check_button_pressed(0, mb_left)) {
		scroll_dragging = true;
		touch_start_y = device_mouse_y(0);
		scroll_start_y = scroll_y;
	}

	if (scroll_dragging) {
		var dy = device_mouse_y(0) - touch_start_y;
		scroll_y = scroll_start_y + dy;
	}

	if (device_mouse_check_button_released(0, mb_left)) {
		scroll_dragging = false;
	}
}

var total_height = array_length(playlist_musicas) * (font_get_size(draw_get_font()) + 20);
var max_scroll = 0;
var min_scroll = -(total_height - room_height + 80);

if (total_height < room_height) {
	scroll_y = 0;
} else {
	scroll_y = clamp(scroll_y, min_scroll, max_scroll);
}