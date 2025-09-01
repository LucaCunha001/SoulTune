draw_set_font(fnt_main);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);

var passados_map = ds_map_create();
var passados_offset = 0;
var len_musics = array_length(musics);

for (var k = 0; k < len_musics; k++) {
	var len_playlist = array_length(musics[k]);
	var offset_values = (k < array_length(lista_musicas_offset)) ? lista_musicas_offset[k] : [];

	var x1 = menu_x;
	var y1 = menu_y + passados_offset;

	var val = musics[k];
	var cap = val[0];
	var idx = val[1];

	var offset_y = 0;
	var extra_h = 0;

	if (array_length(offset_values) > 0) {
		for (var j = 0; j < array_length(offset_values); j++) {
			var limiar = offset_values[j];

			if (idx == limiar) {
				extra_h += 25;
				ds_map_add(passados_map, limiar, true);
			}
			else if (idx > limiar && ds_map_exists(passados_map, limiar)) {
				offset_y += 25;
			}
		}
	}

	var btn_top = y1 + offset_y;
	var btn_bottom = y1 + offset_y + btn_height + extra_h;

	draw_bordered_rect(
		x1 - 4, btn_top - 4,
		x1 + btn_width + 4, btn_bottom + 4,
		2,
		(idx == hovered_btn[1] && cap == hovered_btn[0])
	);

	draw_set_color(c_white);
	draw_text_customizado(
		x1 + 10, y1 + 10 + offset_y,
		scr_getmusicname(idx, cap),
		24
	);

	passados_offset += btn_height + btn_spacing + scroll_y + extra_h;
}

ds_map_destroy(passados_map);

