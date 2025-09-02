playlist_nome = global.playlist;
playlist_musicas  = struct_get(global.playlists, playlist_nome);

botoes = [
	scr_make_button(20,  15, 100, 20, scr_gettext("obj_editar_playlist_voltar"), function() {
		instance_create_depth(0, 0, depth, obj_playlists_select);
		instance_destroy();
	}),
	scr_make_button(20,  45, 100, 20, scr_gettext("obj_editar_playlist_renomear"), function() {
		var inst = instance_create_depth(0, 0, depth-1, obj_inputbox);
		inst.titulo = scr_gettext("obj_editar_playlist_nnp");
		inst.texto  = global.playlist;
		inst.confirm_callback = function(novo_nome) {
			if (novo_nome != "" && !variable_struct_exists(global.playlists, novo_nome)) {
				struct_set(global.playlists, novo_nome, playlist_musicas);
				struct_remove(global.playlists, playlist_nome);
				playlist_nome   = novo_nome;
				global.playlist = novo_nome;
			}
			save_playlists();
		};
	}),
	scr_make_button(20,  75, 100, 20, scr_gettext("obj_editar_playlist_adicionar"), function() {
		var inst = instance_create_depth(0, 0, depth-1, obj_listselect);
		inst.titulo = scr_gettext("obj_editar_playlist_capítulo");
		inst.opcoes = ["Undertale", "Cap 1 Deltaurne", "Cap 2 Deltaurne", "Cap 3 Deltaurne", "Cap 4 Deltaurne"];
		inst.confirm_callback = function(op) {
			cap = 0;
			if (string_starts_with(op, "C")) {
				cap = real(string_char_at(op, 5));
			}
			var inst2 = instance_create_depth(0, 0, depth-1, obj_listselect);
			inst2.cap = cap;
			inst2.titulo = scr_gettext("obj_editar_playlist_escolher");
			inst2.opcoes = [];
			musiccount = [100, 40, 47, 38, 40];
			
			for (var i=0; i<musiccount[cap]; i++) {
				array_push(inst2.opcoes, scr_getmusicname(i+1,cap));
			}
			inst2.confirm_callback = function(idx_nome) {
				var idx = array_get_index(obj_listselect.opcoes, idx_nome)+1;
				array_push(obj_editar_playlist.playlist_musicas, [obj_listselect.cap, idx]);
				struct_set(global.playlists, global.playlist, obj_editar_playlist.playlist_musicas);
				save_playlists();
			};
		}
	}),
	scr_make_button(20, 105, 100, 20, scr_gettext("obj_editar_playlist_remover"), function() {
		if (array_length(playlist_musicas) > 0) {
			remover_modo = true;
		}
	})
];

hovered_btn = -1;
tocou_som   = false;

scroll_y = 0;
scroll_speed = 20;
scroll_dragging = false;
touch_start_y = 0;
scroll_start_y = 0;

remover_modo = false;