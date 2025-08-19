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
global.backgrounds = [spr_backgroundgif, spr_background2, spr_background3, spr_annoyingdog, spr_background4, spr_background5];
global.background_index = 0;
global.deltarune_cap = 0;
global.update_message = "";

draw_set_font(fnt_main);

load_user_options();

__init_load_osts();
load_osts();

audio_master_gain(global.volume);

startService();

function choose_from_array(arr) {
	return arr[irandom(array_length(arr)-1)];
}

var music_map = ds_map_create();

ds_map_add(music_map, 0, [[31, 40], 1]);
ds_map_add(music_map, 3, [[21], 0]);
ds_map_add(music_map, 4, [[13, 19], 1]);
ds_map_add(music_map, 5, [[49, 59, 61, 92], 0]);

var music_entry = ds_map_find_value(music_map, global.background_index);

if (music_entry != undefined) {
	var options = music_entry[0];
	var loop_flag = music_entry[1];
	var background_music = [choose_from_array(options), loop_flag];
	
	show_debug_message(global.background_index);
	show_debug_message(background_music)
	tocar_musica(background_music[0], background_music[1], true);
} else {
	tocar_musica(2, irandom(4), true);
}

ds_map_destroy(music_map);

instance_create_depth(0, 0, depth, obj_update);
instance_create_depth(0, 0, depth, obj_background);
instance_create_depth(0, 0, depth-1, obj_main_menu);
instance_destroy();