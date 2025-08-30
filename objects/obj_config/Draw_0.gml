draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_font(fnt_main);
draw_set_color(c_white);

draw_text_customizado(room_width/2, 15, scr_gettext("obj_config_versao") + ": " + GM_version);

for (var i = 0; i < total; i++) {
	var col = i mod 2;
	var row = floor(i / 2);

	var x1 = (col == 0) ? x_left : x_right;
	var y1 = base_y + row * (btn_height + btn_spacing);

	if (total mod 2 == 1 && i == total - 1) {
		x1 = (room_width - btn_width)/2;
	}

	draw_bordered_rect(x1 - 6, y1 - 6, x1 + btn_width + 6, y1 + btn_height + 6, 2, (hovered_btn == i));

	draw_set_color(c_white);
	draw_text_customizado(x1 + btn_width/2, y1 + btn_height/2, settings_buttons[i], 22);
}

var back_hovered = point_in_rectangle(mouse_x, mouse_y, btn_back_x, btn_back_y, btn_back_x + btn_back_w, btn_back_y + btn_back_h);
draw_bordered_rect(btn_back_x - 6, btn_back_y - 6, btn_back_x + btn_back_w + 6, btn_back_y + btn_back_h + 6, 2, back_hovered);

draw_set_color(c_white);
draw_text(btn_back_x + btn_back_w / 2, btn_back_y + btn_back_h / 2, scr_gettext("obj_config_voltar"));

var credits_hovered = point_in_rectangle(mouse_x, mouse_y, btn_credits_x, btn_credits_y, btn_credits_x + btn_credits_w, btn_credits_y + btn_credits_h);
draw_bordered_rect(btn_credits_x - 6, btn_credits_y - 6, btn_credits_x + btn_credits_w + 6, btn_credits_y + btn_credits_h + 6, 2, credits_hovered);

draw_set_color(c_white);
draw_text(btn_credits_x + btn_credits_w / 2, btn_credits_y + btn_credits_h / 2, scr_gettext("obj_config_creditos"));

var repo_hovered = point_in_rectangle(mouse_x, mouse_y, btn_repo_x, btn_repo_y, btn_repo_x + btn_repo_w, btn_repo_y + btn_repo_h);
draw_bordered_rect(btn_repo_x - 6, btn_repo_y - 6, btn_repo_x + btn_repo_w + 6, btn_repo_y + btn_repo_h + 6, 2, repo_hovered);

draw_set_color(c_white);
draw_text(btn_repo_x + btn_repo_w / 2, btn_repo_y + btn_repo_h / 2, scr_gettext("obj_config_repo"));

draw_set_halign(fa_left);
draw_set_valign(fa_middle);

draw_bordered_rect(slider_x - 6, slider_y - 32, slider_x + slider_w + 6, slider_y + slider_h + 6, 2, false);
draw_text(slider_x, slider_y - 20, scr_gettext("obj_config_volume") + ": " + string(int64(global.volume * 100)) + "%");

draw_set_color(c_white);
draw_rectangle(slider_x, slider_y, slider_x + slider_w, slider_y + slider_h, false);
draw_set_color(c_yellow);
draw_rectangle(slider_x, slider_y, slider_x + global.volume * slider_w, slider_y + slider_h, false);

var handle_x = slider_x + global.volume * slider_w;
var handle_y = slider_y + slider_h/2;

draw_circle(handle_x, handle_y, slider_handle_r, false);