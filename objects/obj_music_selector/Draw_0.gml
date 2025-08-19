draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var total_w = array_length(simple_buttons) * btn_u_width + (array_length(simple_buttons) - 1) * btn_spacing;
var base_x = (room_width - total_w) / 2;
var y1 = 80;

for (var i = 0; i < array_length(simple_buttons); i++) {
	var x1 = base_x + i * (btn_u_width + btn_spacing);

	draw_bordered_rect(x1 - 6, y1 - 6, x1 + btn_u_width + 6, y1 + btn_height + 6, 2, (hovered_section == 0 && hovered_btn == i));

	draw_set_color(c_white);
	draw_text_customizado(x1 + btn_u_width / 2 + 4, y1 + btn_height / 2, simple_buttons[i]);
}

var total_w2 = array_length(img_buttons) * btn_d_width + (array_length(img_buttons) - 1) * btn_spacing;
var base_x2 = (room_width - total_w2) / 2;
var y2 = 200;

for (var i = 0; i < array_length(img_buttons); i++) {
	var x2 = base_x2 + i * (btn_d_width + btn_spacing);

	draw_bordered_rect(x2 - 6, y2 - 6, x2 + btn_d_width + 6, y2 + btn_height + 6, 2, (hovered_section == 1 && hovered_btn == i));

	draw_set_color(c_white);
	draw_sprite(img_buttons[i][1], 0, x2 + (btn_d_width - sprite_get_width(img_buttons[i][1])) / 2, y2);
	draw_text_customizado(x2 + btn_d_width / 2 + 4, y2 + 50, img_buttons[i][0]);
}