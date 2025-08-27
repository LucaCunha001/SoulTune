var spr = global.backgrounds[global.background_index];
var sw = sprite_get_width(spr);
var sh = sprite_get_height(spr);

if (global.primeiro_de_abril) {
	spr = ASGORE_MEME_SPRITES[ASGORE_MEME_FASE];
	var spr_frames = sprite_get_number(spr);

	if (ASGORE_MEME_FASE == 1 && ceil(global.current_music_time) >= global.music_duration - 0.5 && !ASGORE_ATROPELOU) {
		ASGORE_ATROPELOU = true;
		ASGORE_MEME_FASE++;
		spr = ASGORE_MEME_SPRITES[ASGORE_MEME_FASE];
		sprite_index = spr;
	}
	else if (ceil(image_index) == spr_frames - 1) {
		if (ASGORE_MEME_FASE == 2) image_speed = 0;
		if (ASGORE_MEME_FASE == 0) {
			ASGORE_MEME_FASE = (ASGORE_MEME_FASE + 1) mod array_length(ASGORE_MEME_SPRITES);
		}
		spr = ASGORE_MEME_SPRITES[ASGORE_MEME_FASE];
		sprite_index = spr;
	}

	if (global.current_music_time == 0) {
		image_speed = 1;
		image_index = 0;
		ASGORE_MEME_FASE = 0;
		ASGORE_ATROPELOU = false;
	}
}

var multiplicador = (global.background_index == 0) ? 1 : 2;
var limite = 0.5 * multiplicador;

if (sprite_index != spr) {
	napstablook_index = irandom(15);
	sprite_index = spr;
	ANIM_SINER = ANIM_SINER_B = BG_SINER = BG_ALPHA = 0;
}

if (BG_ALPHA < limite) {
	BG_ALPHA += (0.04 - (BG_ALPHA / (14 * multiplicador))) * multiplicador;
	if (BG_ALPHA > limite) BG_ALPHA = limite;
}

if (global.primeiro_de_abril) {
	var linha_ = [
		"Drving in my car, right after a beer",
		"Driving in my truck, right after a beer"
	]
	var index_musica = string_starts_with(global.musica_atual, "-");
	if ASGORE_LETRAS[0] != linha_[index_musica] {
		ASGORE_LETRAS[0] = linha_[index_musica];
	}

	var xscale = room_width / sw;
	var yscale = room_height / sh;
	draw_sprite_ext(spr, image_index, 0, 0, xscale, yscale, 0, c_white, BG_ALPHA);

	var tempo = 0;
	ASGORE_LETRA_INDEX = 0;
	var letras_len = array_length(ASGORE_LETRAS);
	for (var i = 0; i < letras_len; i++) {
		tempo += ASGORE_LETRAS_DELAY[i];
		if (global.current_music_time < tempo) {
			ASGORE_LETRA_INDEX = i;
			break;
		}
	}

	draw_set_halign(fa_left);
	draw_set_valign(fa_middle);
	draw_set_color(c_white);
	draw_bordered_rect(30, room_height - 34, room_width - 30, room_height-4, 2);

	draw_set_halign(fa_center);
	draw_set_valign(fa_top);
	draw_text_customizado(room_width/2, room_height - 26, ASGORE_LETRAS[ASGORE_LETRA_INDEX]);
	draw_set_halign(fa_left);
}
else {
	switch (global.background_index) {
		case 0:
			var size = room_height / sprite_get_height(spr_background);
			var wave_width = sprite_get_width(spr_background);

			ANIM_SINER += BG_SPEED;
			ANIM_SINER_B += BG_SPEED;
			BG_SINER += BG_SPEED;

			var xpos_bg = (room_width - wave_width * size) * 0.5;
			for (var i = 0; i < (wave_width - 130); i++) {
				var waveminus = BGMAGNITUDE * (i / sprite_get_height(spr_background)) * 1.3;
				var wavemag = (waveminus > BGMAGNITUDE) ? 0 : (BGMAGNITUDE - waveminus);

				var xoffset = sin((i / 8) + (BG_SINER / 30)) * wavemag;
				var y_ = i * size;

				draw_sprite_part_ext(spr_background, 0, 0, i, wave_width, 1, xpos_bg + xoffset, y_, size, size, image_blend, BG_ALPHA * 0.8);
				draw_sprite_part_ext(spr_background, 0, 0, i, wave_width, 1, xpos_bg - xoffset, y_, size, size, image_blend, BG_ALPHA * 0.8);
			}

			var gif_x = (room_width - sprite_get_width(spr_backgroundgif) * size) * 0.5;
			var gif_y = sprite_get_height(spr_background) * size - 70;
			var bg_alphas = [0.46, 0.56, 0.7];

			for (var j = 0; j < 3; j++) {
				draw_sprite_ext(spr_backgroundgif, ANIM_SINER / 12 + j * 0.4, gif_x, gif_y, size, size, 0, image_blend, BG_ALPHA * bg_alphas[j]);
			}

			draw_set_color($DF4F00);
			for (var j = 0; j < 3; j++) {
				draw_set_alpha(BG_ALPHA * bg_alphas[j]);
				draw_rectangle(0, room_height - 14, gif_x-1, room_height, false);
				draw_rectangle(gif_x + sw * size, room_height - 14, room_width, room_height, false);
			}
			draw_set_alpha(1);
			break;

		case 3:
		case 10:
			draw_set_color(c_black);
			draw_set_alpha(BG_ALPHA);
			draw_rectangle(0, 0, room_width, room_height, false);
			draw_set_alpha(1);

			var scale = room_width / sw / 8;
			var xpos = (room_width  - (sw * scale)) * 0.5;
			var ypos = (room_height - (sh * scale)) * 0.5;
			
			if (global.background_index == 10) {
				var ww = sprite_get_width(waver_sprite);
				var hh = sprite_get_height(waver_sprite);

				var offset_max = abs(c);

				var scale_w = (room_width + offset_max * 2) / ww;
				var scale_h = (room_height) / hh;

				for (var i = 0; i < hh; i++) {
					a++;
					var xoff = sin(a / b) * c;
					draw_sprite_part_ext(
						waver_sprite, image_index,
						0, i, ww, 1,
						-offset_max + xoff, i * scale_h,
						scale_w, scale_h,
						c_white, BG_ALPHA
					);
				}
			}
			draw_sprite_ext(spr, image_index, xpos, ypos, scale, scale, 0, c_white, BG_ALPHA);

			draw_set_color(c_white);
			draw_set_valign(fa_middle);
			draw_set_alpha(BG_ALPHA);

			if (global.background_index == 3) {
				draw_set_halign(fa_center);
				draw_text_customizado(room_width/2, room_height/2 + 50, scr_gettext("obj_background_annoyingdog"));
			} else {
				draw_set_halign(fa_left);
				var limite_napsta = 30;
				var dialogo = scr_process_dialog(scr_gettext("obj_background_napstablook" + string(napstablook_index)), limite_napsta);
				draw_text_customizado((room_width - limite_napsta*8)/2, room_height/2 + 75, dialogo);
			}
			draw_set_alpha(1);
			break;

		default:
			var xscale = room_width / sw;
			var yscale = room_height / sh;
			draw_sprite_ext(spr, image_index, 0, 0, xscale, yscale, 0, c_white, BG_ALPHA);
			break;
	}
}

outras_funcoes();