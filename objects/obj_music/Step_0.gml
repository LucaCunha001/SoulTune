hovered_btn = -1;

var passados = [];
var passados_offset = 0;

for (var i = 0; i < array_length(musics); i++) {
	var x1 = menu_x;
	var y1 = menu_y + i * (btn_height + btn_spacing) + scroll_y;

	var offset_y = 0;
	var extra_h  = 0;

	if (global.deltarune_cap < array_length(lista_musicas_offset)) {
		var offset_value  = 25;

		for (var j = 0; j < array_length(lista_musicas_offset[global.deltarune_cap]); j++) {
			var limiar = lista_musicas_offset[global.deltarune_cap][j];

			if (musics[i][1] == limiar) {
				extra_h += offset_value;
				array_push(passados, limiar);
			}
			if (musics[i][1] > limiar) && array_contains(passados, limiar) {
				offset_y += offset_value;
			}
		}
	}
	
	passados_offset += extra_h;
	
	if (point_in_rectangle(mouse_x, mouse_y, x1, y1 + offset_y, x1 + btn_width, y1 + btn_height + extra_h + offset_y)) {
		hovered_btn = i;

		if (!tocou_som) {
			tocou_som = true;
			audio_sound_select(snd_squeak);
		}

		if (mouse_check_button_pressed(mb_left)) {
			selected_music = i;

			tocar_musica(musics[i][1], global.deltarune_cap, global.is_looping);

			audio_sound_select(snd_select);
		}
	}
}

if (hovered_btn == -1) {
	tocou_som = false;
}

if (mouse_wheel_up()) scroll_y = min(scroll_y + scroll_speed, 0);
if (mouse_wheel_down()) scroll_y -= scroll_speed;

if (os_type == os_android) {
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

var total_height = array_length(musics) * (btn_height + btn_spacing) + passados_offset;
var max_scroll = 0;
var min_scroll = -(total_height - room_height + menu_y);

if (total_height < room_height) {
	scroll_y = 0;
} else {
	scroll_y = clamp(scroll_y, min_scroll, max_scroll);
}
