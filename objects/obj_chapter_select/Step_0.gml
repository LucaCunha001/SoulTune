hovered_btn = noone;

for (var i = 0; i < btn_count; i++) {
	var x1 = menu_x + i * (btn_width + btn_spacing);
	var y1 = menu_y;

	if (point_in_rectangle(mouse_x, mouse_y, x1, y1, x1 + btn_width, y1 + btn_height)) {
		hovered_btn = i;
		break;
	}
}

if (hovered_btn != noone && !hover_sound_played) {
	audio_sound_select(snd_squeak);
	hover_sound_played = true;
}
if (hovered_btn == noone) {
	hover_sound_played = false;
}

if (mouse_check_button_pressed(mb_left) && !clicking && hovered_btn != noone) {
	clicking = true;
	global.deltarune_cap = hovered_btn + 1;
	load_osts();
	audio_sound_select(snd_select);
	alarm[0] = sound_get_length(snd_select);
}