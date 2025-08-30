/// DRAW
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color(c_white);

if (keyboard_check_pressed(vk_f2)) credit_index++;

if (!glowing_active) {
	if (credit_index == 0) {
		var textos = ["appname", "by"];
		for (var i = 0; i < array_length(textos); i++) {
			draw_text(room_width/2, room_height/2 - espacamento + espacamento*i*2,
				scr_gettext("obj_credits_" + creditos_names[credit_index] + "_" + textos[i]));
		}
	} else {
		if (credit_index >= array_length(creditos_names)) exit;

		var linhas = [];
		var titulo_i = 0;

		while (true) {
			var titulo_key = "obj_credits_" + creditos_names[credit_index] + "_title" + string(titulo_i);
			var titulo_txt = scr_gettext(titulo_key);
			if (titulo_txt == "" || titulo_txt == string(undefined)) break;

			array_push(linhas, [titulo_txt, c_gray]);

			var item_j = 0;
			while (true) {
				var item_key = "obj_credits_" + creditos_names[credit_index] + "_item" + string(titulo_i) + "_" + string(item_j);
				var item_txt = scr_gettext(item_key);
				if (item_txt == "" || item_txt == string(undefined)) break;

				array_push(linhas, [item_txt, c_white]);
				item_j++;
			}

			titulo_i++;
		}

		var total = array_length(linhas);
		var base_y = room_height/2 - (total-1) * espacamento / 2;

		for (var i = 0; i < total; i++) {
			draw_set_color(linhas[i][1]);
			draw_text(room_width/2, base_y + i*espacamento, linhas[i][0]);
		}
	}
}

teclas();
