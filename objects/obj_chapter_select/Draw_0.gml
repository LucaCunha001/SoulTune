draw_set_color(c_white);

draw_set_halign(fa_left);
draw_set_valign(fa_top);

var texto = scr_gettext("obj_chapter_select_escolher_capitulo");
draw_text_customizado((room_width - string_width(texto))/2, menu_y-25, texto);

for (var i = 0; i < btn_count; i++) {
	var x1 = menu_x + i * (btn_width + btn_spacing);
	var y1 = menu_y;

	draw_bordered_rect(x1 - 6, y1 - 6, x1 + btn_width + 6, y1 + btn_height + 6, 2, (hovered_btn == i));

	draw_set_color(c_white);
	draw_sprite(spr_delta_chapters, i+1, x1, y1);
}