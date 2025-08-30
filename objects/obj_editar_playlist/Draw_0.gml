draw_set_font(fnt_main);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);

draw_set_color(c_white);
draw_text(200, 20, scr_gettext("obj_editar_playlist_editando") + playlist_nome);

for (var i = 0; i < array_length(botoes); i++) {
	var b = botoes[i];
	var cor = (hovered_btn == i) ? c_yellow : c_white;
	draw_bordered_rect(b.x-2, b.y-2, b.x+b.w+2, b.y+b.h+2, 2, hovered_btn==i);
	draw_set_color(cor);
	draw_text(b.x+10, b.y+b.h/2, b.label);
}

var y0 = 80;
for (var j = 0; j < array_length(playlist_musicas); j++) {
	var info = playlist_musicas[j];
	var cap  = info[0];
	var idx  = info[1];

	var txt_y = y0 + j*20 + scroll_y;

	if (remover_modo && point_in_rectangle(mouse_x, mouse_y, 200, txt_y-8, 400, txt_y+8)) {
		draw_set_color(c_red);
	} else {
		draw_set_color(c_white);
	}

	draw_text(200, txt_y, "Cap " + string(cap) + " | " + scr_gettext("obj_editar_playlist_musica") + string(idx));
}

if (remover_modo) {
	draw_set_color(c_red);
	draw_text(200, 60, scr_gettext("obj_editar_playlist_remove_desc"));
}

var visible_height = 200;
var total_height   = array_length(playlist_musicas)*20;
if (total_height > visible_height) {
	var bar_h = visible_height * visible_height / total_height;
	var bar_y = 80 - scroll_y * (visible_height / total_height);
	draw_set_color(c_gray);
	draw_rectangle(380, 80, 390, 280, false);
	draw_set_color(c_white);
	draw_rectangle(380, bar_y, 390, bar_y+bar_h, false);
}