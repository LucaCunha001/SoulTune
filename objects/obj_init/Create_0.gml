randomize();

/// Música / Áudio
global.current_music_time = 0;
global.music_delta_time = 0;
global.music_duration = 0;
global.music_index = [-1, -1];
global.musica_atual = "";
global.is_playing = false;
global.is_looping = false;
global.volume = 1;
global.tocar_som = true;

/// Filtros e efeitos
global.filtro = "";
global.filtros = ds_map_create();

/// Pastas e playlists
global.folder = "";
global.folders = [];
global.playlists = [];

/// Idioma / Localização
global.language = "pt-br";
global.language_data = ds_map_create();

/// Backgrounds / Interface
global.backgrounds = [spr_backgroundgif, spr_background2, spr_background3, spr_annoyingdog, spr_background4, spr_background5, spr_background6, spr_background7, spr_background8, spr_background9];
global.background_index = 0;
global.deltarune_cap = 0;
global.update_message = "";
global.init_fullscreen = false;
global.primeiro_de_abril = false;

draw_set_font(fnt_main);

load_user_options();

__init_load_osts();
load_osts();

window_set_fullscreen(global.init_fullscreen);

audio_master_gain(global.volume);

startService();

load_playlists();

function choose_from_array(arr) {
	return arr[irandom(array_length(arr)-1)];
}

var music_map = ds_map_create();

ds_map_add(music_map, 0, [[31, 40], 1]);
ds_map_add(music_map, 1, [[1, 11, 15, 20], 1]);
ds_map_add(music_map, 2, [[12, 13, 85, 92], 0]);
ds_map_add(music_map, 3, [[21], 0]);
ds_map_add(music_map, 4, [[13, 19], 1]);
ds_map_add(music_map, 5, [[49, 59, 61, 92], 0]);
ds_map_add(music_map, 6, [[5, 6, 12, 13], 0]);
ds_map_add(music_map, 7, [[1, 3], 2]);
ds_map_add(music_map, 8, [[23, 31, 33], 0]);
ds_map_add(music_map, 9, [[[8], [36]], [1, 2]]);

var music_entry = ds_map_find_value(music_map, global.background_index);

if (music_entry != undefined) {
	var options = music_entry[0];
	var loop_flag = music_entry[1];

	var background_music = [choose_from_array(options), loop_flag];
	
	if (is_array(loop_flag)) {
		var capitulo = irandom(array_length(loop_flag));
		background_music = [choose_from_array(options[capitulo]), loop_flag[capitulo]];
	}

	
	tocar_musica(background_music[0], background_music[1], true);
} else {
	tocar_musica(2, irandom(4), true);
}

ds_map_destroy(music_map);

instance_create_depth(0, 0, depth, obj_update);
instance_create_depth(0, 0, depth, obj_background);
instance_create_depth(0, 0, depth-1, obj_main_menu);
instance_destroy();