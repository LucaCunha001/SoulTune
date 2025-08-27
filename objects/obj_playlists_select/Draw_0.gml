draw_set_font(fnt_main);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);

for (var i = 0; i < struct_names_count(global.playlists); i++) {
	var x1 = menu_x;
	var y1 = menu_y + i * (btn_height + btn_spacing) + scroll_y;

	var offset_y = 0;
	var extra_h  = 0;

	draw_bordered_rect(x1 - 4, y1 - 4 + offset_y, x1 + btn_width + 4, y1 + btn_height + 4 + extra_h + offset_y, 2, (i == hovered_btn));

	draw_set_color(c_white);
	draw_text_customizado(x1 + 10, y1 + 10 + offset_y, playlist_chaves[i], 24);
}