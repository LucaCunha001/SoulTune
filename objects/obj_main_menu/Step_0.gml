var mouse_over1 = point_in_rectangle(mouse_x, mouse_y, btn1_x - padding, btn1_y - padding, btn1_x + sprite_get_width(btn1_sprite) + padding, btn1_y + sprite_get_height(btn1_sprite) + padding);
var mouse_over2 = point_in_rectangle(mouse_x, mouse_y, btn2_x - padding, btn2_y - padding, btn2_x + sprite_get_width(btn2_sprite) + padding, btn2_y + sprite_get_height(btn2_sprite) + padding);
var mouse_overconfig = point_in_rectangle(mouse_x, mouse_y, config_btnx - padding, config_btny - padding, config_btnx + sprite_get_width(config_btnsprite) + padding, config_btny + sprite_get_height(config_btnsprite) + padding);

if (mouse_over1) {
	if (hovered_btn != 1) {
		audio_sound_select(snd_squeak);
	}
	hovered_btn = 1;

} else if (mouse_over2) {
	if (hovered_btn != 2) {
		audio_sound_select(snd_squeak);
	}
	hovered_btn = 2;

} else if (mouse_overconfig) {
	if (hovered_btn != 3) {
		audio_sound_select(snd_squeak);
	}
	hovered_btn = 3;

} else {
	hovered_btn = noone;
}

if (mouse_check_button_pressed(mb_left) && !clicking) {
	if (hovered_btn > 0) {
		clicking = true;
		audio_sound_select(snd_select);

		switch (hovered_btn) {
			case 1:
				global.deltarune_cap = 0;
				load_osts();
				alarm[0] = sound_get_length(snd_select);
				break;

			case 2:
				global.deltarune_cap = 1;
				alarm[0] = sound_get_length(snd_select);
				break;

			case 3:
				instance_create_depth(0, 0, depth, obj_config);
				instance_destroy();
				break;
		}
	}
}