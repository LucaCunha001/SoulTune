var passados = [];
var passados_offset = 0;
var len_musics = array_length(musics);

for (var k = 0; k < len_musics; k++) {
	var playlist = musics[k];
	var len_playlist = array_length(playlist);
	var offset_values = (k < array_length(lista_musicas_offset)) ? lista_musicas_offset[k] : [];

	var val = playlist;
	var cap = val[0];
	var idx = val[1];

	var x1 = menu_x;
	var y1 = menu_y + passados_offset;

	var offset_y = 0;
	var extra_h  = 0;

	if (array_length(offset_values) > 0) {
		for (var j = 0; j < array_length(offset_values); j++) {
			var limiar = offset_values[j];
			if (idx == limiar) {
				extra_h += 25;
				array_push(passados, limiar);
			}
			else if (idx > limiar && array_contains(passados, limiar)) {
				offset_y += 25;
			}
		}
	}

	passados_offset += btn_height + btn_spacing + scroll_y + extra_h;

	var btn_top = y1 + offset_y;
	var btn_bottom = y1 + extra_h + offset_y + btn_height;

	if (point_in_rectangle(mouse_x, mouse_y, x1, btn_top, x1 + btn_width, btn_bottom)) {
		hovered_btn = val;

		if (!tocou_som) {
			tocou_som = true;
			audio_sound_select(snd_squeak);
		}

		if (mouse_check_button_pressed(mb_left)) {
			selected_music = hovered_btn;
			global.playlist_music_index = k;
			global.playlist_atual = global.playlist;
			tocar_musica(idx, cap, global.is_looping);
			audio_sound_select(snd_select);
		}
	}
}
