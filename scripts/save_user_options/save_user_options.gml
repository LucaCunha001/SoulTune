function save_user_options() {
	var file = "user_options.ini";
	ini_open(file);

	ini_write_string("Idioma", "idioma", global.language);
	ini_write_real("Background", "background", global.background_index);
	ini_write_real("Som", "volume", global.volume);
	ini_write_real("Som", "tocar_selects", global.tocar_som);
	ini_write_real("GUI", "tela_cheia", global.init_fullscreen);

	ini_close();
}