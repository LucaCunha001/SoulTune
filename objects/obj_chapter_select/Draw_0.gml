draw_set_color(c_white);

draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var texto = scr_gettext("obj_chapter_select_escolher_capitulo");
draw_text_customizado(room_width/2, menu_y-35, texto);

for (var i = 0; i < btn_count; i++) {
	var x1 = menu_x + i * (btn_width + btn_spacing);
	var y1 = menu_y;

	var bx1 = x1;
	var by1 = y1;
	var bx2 = x1 + btn_width;
	var by2 = y1 + btn_height;

	draw_bordered_rect(bx1, by1, bx2, by2, 2, (hovered_btn == i));

	draw_set_color(c_white);
	draw_sprite(sprite_index, i+1, x1 + padding/2, y1 + padding/2);
}