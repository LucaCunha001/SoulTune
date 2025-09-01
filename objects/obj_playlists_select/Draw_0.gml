draw_set_font(fnt_main);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);

for (var j = 0; j < array_length(lateral_buttons); j++) {
	var b = lateral_buttons[j];
	draw_bordered_rect(b.x - 2, b.y - 2, b.x + b.w + 2, b.y + b.h + 2, 2, (hovered_lateral == j || (modo == string_lower(array_get(lateral_names, j)))));
	draw_set_color(c_white);
	draw_text_customizado(b.x + 10, b.y + b.h / 2 + 4, lateral_names[j], 16);
}

for (var i = 0; i < struct_names_count(global.playlists); i++) {
	var x1 = menu_x;
	var y1 = menu_y + i * (btn_height + btn_spacing) + scroll_y;

	var offset_y = 0;
	var extra_h  = 0;

	draw_bordered_rect(x1 - 4, y1 - 4 + offset_y, x1 + btn_width + 4, y1 + btn_height + 4 + extra_h + offset_y, 2, (i == hovered_btn));
	draw_set_color(c_white);
	draw_text_customizado(x1 + 10, y1 + 10 + offset_y, playlist_chaves[i], 24);
}
