draw_set_color(c_white);
draw_set_font(fnt_main);
draw_text(100, 100, titulo);
draw_bordered_rect(95, 135, 400, 165, 2, false);
draw_text(100, 150, texto);

if (mouse_check_button(mb_left)) {
	if (mouse_x == clamp(mouse_x, 95, 400) && mouse_y == clamp(mouse_y, 135, 165)) {
		keyboard_virtual_show(kbv_type_ascii, kbv_returnkey_go, kbv_autocapitalize_words, true);
	} else {
		keyboard_virtual_hide();
	}
}
