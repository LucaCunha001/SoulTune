draw_set_font(fnt_main);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);

var passados = [];

for (var i = 0; i < array_length(musics); i++) {
	var x1 = menu_x;
	var y1 = menu_y + i * (btn_height + btn_spacing) + scroll_y;

	var offset_y = 0;
	var extra_h  = 0;

	if (global.deltarune_cap == 0) {
		var offset_value = 25;
		for (var j = 0; j < array_length(lista_musicas_offset); j++) {
			var limiar = lista_musicas_offset[j]
			if (musics[i][1] == limiar) {
				extra_h  += offset_value;
				array_push(passados, limiar);
			}
			if (musics[i][1] > limiar) && array_contains(passados, limiar) {
				offset_y += offset_value;
			}
		}
	}

	draw_bordered_rect(x1 - 4, y1 - 4 + offset_y, x1 + btn_width + 4, y1 + btn_height + 4 + extra_h + offset_y, 2, (i == hovered_btn));

	draw_set_color(c_white);
	draw_text_customizado(x1 + 10, y1 + 10 + offset_y, musics[i][0], 24);
}
