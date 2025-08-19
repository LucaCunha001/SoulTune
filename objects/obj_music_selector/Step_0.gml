hovered_btn = -1;
hovered_section = -1;

var mouse_over_any = false;

var total_w = array_length(simple_buttons) * btn_u_width + (array_length(simple_buttons) - 1) * btn_spacing;
var base_x = (room_width - total_w) / 2;
var y1 = 80;

for (var i = 0; i < array_length(simple_buttons); i++) {
	var x1 = base_x + i * (btn_u_width + btn_spacing);
	if (point_in_rectangle(mouse_x, mouse_y, x1, y1, x1 + btn_u_width, y1 + btn_height)) {
		hovered_btn = i;
		hovered_section = 0;
		mouse_over_any = true;
		break;
	}
}

if (!mouse_over_any) {
	var total_w2 = array_length(img_buttons) * btn_d_width + (array_length(img_buttons) - 1) * btn_spacing;
	var base_x2 = (room_width - total_w2) / 2;
	var y2 = 200;

	for (var i = 0; i < array_length(img_buttons); i++) {
		var x2 = base_x2 + i * (btn_d_width + btn_spacing);
		if (point_in_rectangle(mouse_x, mouse_y, x2, y2, x2 + btn_d_width, y2 + btn_height)) {
			hovered_btn = i;
			hovered_section = 1;
			mouse_over_any = true;
			break;
		}
	}
}

if (hovered_btn != -1 && !hover_sound_played) {
	audio_sound_select(snd_squeak);
	hover_sound_played = true;
}
if (hovered_btn == -1) {
	hover_sound_played = false;
}

if (mouse_check_button_pressed(mb_left) && hovered_btn != -1 && !clicking) {
	clicking = true;
	audio_sound_select(snd_select);
	alarm[0] = 2;
}

fullscreen();