var spr = global.backgrounds[global.background_index];

if (sprite_index != spr) {
	sprite_index = spr;
}

var sw = sprite_get_width(spr);
var sh = sprite_get_height(spr);

switch (global.background_index) {
	case 0:
		draw_set_color($DF4F00);
		draw_rectangle(0, room_height - 14, room_width, room_height, false);

		var size = room_height / sprite_get_height(spr_background);
		var wave_width = sprite_get_width(spr_background);

		ANIM_SINER += 1;
		ANIM_SINER_B += 1;
		BG_SINER += 1;

		if (BG_ALPHA < 0.5) {BG_ALPHA += (0.04 - (BG_ALPHA / 14));}
		if (BG_ALPHA > 0.5) {BG_ALPHA = 0.5;}

		var xpos_bg = (room_width - wave_width * size) * 0.5;

		for (var i = 0; i < (wave_width - 130); i++)
		{
			var waveminus = BGMAGNITUDE * (i / sprite_get_height(spr_background)) * 1.3;
			var wavemag = (waveminus > BGMAGNITUDE) ? 0 : (BGMAGNITUDE - waveminus);

			var xoffset = sin((i / 8) + (BG_SINER / 30)) * wavemag;
			var y_ = i * size;

			draw_background_part_ext(spr_background, 0, i, wave_width, 1, xpos_bg + xoffset, y_, size, size, image_blend, BG_ALPHA * 0.8);
			draw_background_part_ext(spr_background, 0, i, wave_width, 1, xpos_bg - xoffset, y_, size, size, image_blend, BG_ALPHA * 0.8);
		}

		var gif_x = (room_width - sprite_get_width(spr_backgroundgif) * size) * 0.5;
		var gif_y = sprite_get_height(spr_background) * size - 70;

		draw_sprite_ext(spr_backgroundgif, floor(ANIM_SINER / 12), gif_x, gif_y, size, size, 0, image_blend, BG_ALPHA * 0.46);
		draw_sprite_ext(spr_backgroundgif, floor(ANIM_SINER / 12) + 0.4, gif_x, gif_y, size, size, 0, image_blend, BG_ALPHA * 0.56);
		draw_sprite_ext(spr_backgroundgif, floor(ANIM_SINER / 12) + 0.8, gif_x, gif_y, size, size, 0, image_blend, BG_ALPHA * 0.7);
		break;

	case 3:
		draw_set_color(c_black);
		draw_rectangle(0, 0, room_width, room_height, false);

		var scale = room_width / sw / 8;

		var xpos = (room_width  - (sw * scale)) * 0.5;
		var ypos = (room_height - (sh * scale)) * 0.5;

		draw_sprite_ext(spr, image_index, xpos, ypos, scale, scale, 0, c_white, 1);
		
		draw_set_color(c_white);
		draw_set_valign(fa_middle);
		draw_set_halign(fa_center);
		draw_text_customizado(room_width/2, room_height/2 + 50, scr_gettext("obj_background_annoyingdog"))
		break;
		
	default:
		var xscale = room_width / sw;
		var yscale = room_height / sh;

		draw_sprite_ext(spr, image_index, 0, 0, xscale, yscale, 0, c_white, 1);
		break;
}