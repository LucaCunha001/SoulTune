draw_set_font(fnt_main);
draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var x1 = menu_x;
var y1 = menu_y;
var w  = layout_width;
var h  = layout_height;

draw_bordered_rect(x1 + 4, y1 + 4, x1 + w - 4, y1 + h - 4, 4, false);

if (global.musica_atual != "") {
	draw_set_color(c_white);
	draw_text_customizado(x1 + w/2+4, y1 + 20, global.musica_atual, 20);
} else {
	draw_set_color(c_white);
	draw_text_customizado(x1 + w/2+4, y1 + 20, scr_gettext("obj_music_controller_nan"));
}

var btn_y = y1 + 60;
var btn_text = global.is_playing ? "⏸" : "▶";

var btn_w = 30;
var btn_h = 30;
var btn_x = x1 + w/2 - btn_w - 5;

var is_hover_play = point_in_rectangle(mouse_x, mouse_y, btn_x - 10, btn_y - 10, btn_x + btn_w + 10, btn_y + btn_h + 10);

draw_set_color(is_hover_play ? c_yellow : c_white);
draw_text_customizado(btn_x + btn_w/2, btn_y, btn_text);

var loop_btn_x = x1 + w/2 + btn_w + 5;
var is_hover_loop = point_in_rectangle(mouse_x, mouse_y, loop_btn_x - 10, btn_y - 10, loop_btn_x + btn_w + 10, btn_y + btn_h + 10);

draw_set_color(global.is_looping ? c_lime : (is_hover_loop ? c_yellow : c_white));
draw_text_customizado(loop_btn_x + btn_w/2 - 5, btn_y, "↺");

if (is_hover_loop && mouse_check_button_pressed(mb_left)) {
	global.is_looping = !global.is_looping;
}

var time_y = btn_y + 30;
var current_time_str = string_format_time(progress * global.music_duration);
var total_time_str   = string_format_time(global.music_duration);

draw_set_color(c_white);
draw_text_customizado(x1 + w/2, time_y, current_time_str + " / " + total_time_str);

draw_set_color(c_white);
draw_rectangle(bar_x, bar_y, bar_x + bar_w, bar_y + bar_h, false);
draw_set_color(c_yellow);
draw_rectangle(bar_x, bar_y, bar_x + (bar_w * progress), bar_y + bar_h, false);

var select_btn_y = btn_y + 60;
var select_btn_w = 86;
var select_btn_h = 20;
var select_btn_x = x1 + w/2 - select_btn_w/2;

var is_hover_select = point_in_rectangle(
	mouse_x, mouse_y,
	select_btn_x, select_btn_y,
	select_btn_x + select_btn_w, select_btn_y + select_btn_h
);

draw_bordered_rect(select_btn_x-2, select_btn_y-2, select_btn_x + select_btn_w+2, select_btn_y + select_btn_h+2, 2, is_hover_select);
draw_set_color(c_white)
draw_text_customizado(select_btn_x + select_btn_w/2 + 4, select_btn_y + select_btn_h/2 + 4, scr_gettext("obj_music_controller_select"));

if (is_hover_select && mouse_check_button_pressed(mb_left)) {
	instance_create_depth(0, 0, depth, obj_music_selector);
	instance_destroy(obj_music);
	instance_destroy();
}

var game_cap_x = select_btn_x - 2;
var game_cap_y = select_btn_y + 30;
var size = 1 / 8;

draw_set_color(c_white);
draw_rectangle(game_cap_x - 2, game_cap_y - 2, game_cap_x + sprite_get_height(spr_games)*size + 2, game_cap_y + sprite_get_width(spr_games)*size + 2, false);
draw_sprite_ext(spr_games, global.deltarune_cap - 1*(global.deltarune_cap>=4), game_cap_x, game_cap_y, size, size, 0, c_white, 1);