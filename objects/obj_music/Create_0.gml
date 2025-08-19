musics = [];
btn_spacing = 20;
btn_width = 200;
btn_height = 20;
menu_x = 250;
menu_y = 15;
hovered_btn = -1;
selected_music = -1;
tocou_som = false;

load_osts();
var filtro = scr_getmusicsbyfilter(global.filtro);

for (var j = 0; j < ds_list_size(filtro); j++) {
	var idx = ds_list_find_value(filtro, j);

	var name = scr_getmusicname(idx);
	array_push(musics, [name, idx]);
}

scroll_y = 0;
scroll_speed = 20;
scroll_dragging = false;
touch_start_y = 0;
scroll_start_y = 0;

controller = instance_create_depth(0, 0, depth-1, obj_music_controller);
controller.musics = musics;

lista_musicas_offset = [35, 55];