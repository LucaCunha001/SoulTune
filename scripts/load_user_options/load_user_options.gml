function load_user_options() {
	var file = "user_options.ini";
	ini_open(file);

	global.language = ini_read_string("Idioma", "idioma", "pt-br");
	global.background_index = ini_read_real("Background", "background", 0) mod array_length(global.backgrounds);
	global.volume = ini_read_real("Som", "volume", 1);
	global.tocar_som = bool(ini_read_real("Som", "tocar_selects", 1));
	global.init_fullscreen = bool(ini_read_real("GUI", "tela_cheia", 1));

	ini_close();
}