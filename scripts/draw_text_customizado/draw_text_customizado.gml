/// @function draw_text_customizado(_x, _y, _texto, [_max_chars])
/// @description Desenha texto com tratamento especial e quebra opcional por limite de caracteres.
/// @param {real} _x
/// @param {real} _y
/// @param {string} _texto
/// @param {real} [_max_chars] Limite de caracteres por linha (0 = sem quebra)
function draw_text_customizado(_x, _y, _texto, _max_chars) {
	if (argument_count < 4) _max_chars = 0;

	var linhas = [];

	var partes_texto = string_split(_texto, "\n");

	for (var p = 0; p < array_length(partes_texto); p++) {
		var palavras = string_split(partes_texto[p], " ");
		var linha_atual = "";

		for (var i = 0; i < array_length(palavras); i++) {
			var teste = (linha_atual == "" ? palavras[i] : linha_atual + " " + palavras[i]);

			if (_max_chars > 0 && string_length(teste) > _max_chars) {
				array_push(linhas, linha_atual);
				linha_atual = palavras[i];
			} else {
				linha_atual = teste;
			}
		}

		if (linha_atual != "") {
			array_push(linhas, linha_atual);
		}

		if (p < array_length(partes_texto) - 1) {
			array_push(linhas, "");
		}
	}

	var fonte_altura = font_get_size(draw_get_font());

	for (var l = 0; l < array_length(linhas); l++) {
		var texto_linha = linhas[l];
		var largura_total = 0;

		for (var i = 1; i <= string_length(texto_linha); i++) {
			var c = string_char_at(texto_linha, i);
			switch (c) {
				case "♫": largura_total += sprite_get_width(spr_simbolo_musica) * 0.5; break;
				case "…": largura_total += string_width(".") * 3; break;
				case "＂": c = "\""; largura_total += string_width(c); break;
				case "’": c = "'"; largura_total += string_width(c); break;
				case "？": c = "?"; largura_total += string_width(c); break;
				default: largura_total += string_width(c);
			}
		}

		var halign = draw_get_halign();
		var valign = draw_get_valign();
		var x_draw = _x;
		var y_draw = _y + l * fonte_altura;

		if (halign == fa_center) x_draw -= largura_total / 2;
		else if (halign == fa_right) x_draw -= largura_total;

		if (valign == fa_middle) y_draw -= fonte_altura / 2;
		else if (valign == fa_bottom) y_draw -= fonte_altura;

		var cursor_x = x_draw;

		for (var i = 1; i <= string_length(texto_linha); i++) {
			var c = string_char_at(texto_linha, i);
			switch (c) {
				case "♫":
					draw_sprite_ext(spr_simbolo_musica, 0, cursor_x, y_draw - sprite_get_height(spr_simbolo_musica)*0.25, 0.5, 0.5, 0, draw_get_color(), draw_get_alpha());
					cursor_x += sprite_get_width(spr_simbolo_musica) * 0.5;
					break;
				case "⏸":
					draw_sprite_ext(spr_pause, 0, cursor_x, y_draw - sprite_get_height(spr_pause)*0.25, 0.5, 0.5, 0, draw_get_color(), draw_get_alpha());
					cursor_x += sprite_get_width(spr_pause) * 0.5;
					break;
				case "▶":
					draw_sprite_ext(spr_play, 0, cursor_x, y_draw - sprite_get_height(spr_play)*0.25, 0.5, 0.5, 0, draw_get_color(), draw_get_alpha());
					cursor_x += sprite_get_width(spr_play) * 0.5;
					break;
				case "↺":
					draw_sprite_ext(spr_loop, 0, cursor_x, y_draw - sprite_get_height(spr_loop)*0.25, 0.5, 0.5, 0, draw_get_color(), draw_get_alpha());
					cursor_x += sprite_get_width(spr_loop) * 0.5;
					break;
				case "＂": c = "\""; draw_text(cursor_x, y_draw, c); cursor_x += string_width(c); break;
				case "’": c = "'"; draw_text(cursor_x, y_draw, c); cursor_x += string_width(c); break;
				case "？": c = "?"; draw_text(cursor_x, y_draw, c); cursor_x += string_width(c); break;
				case "…":
					for (var j = 0; j < 3; j++) {
						draw_text(cursor_x, y_draw, ".");
						cursor_x += string_width(".");
					}
					break;
				default:
					draw_text(cursor_x, y_draw, c);
					cursor_x += string_width(c);
			}
		}
	}
}