function load_user_options() {
	var file = "user_options.ini";
	ini_open(file);

	var idioma_ini = ini_read_string("Idioma", "idioma", "");

	if (idioma_ini == "") {
		var lang = os_get_language();

		var latinos = ["pt", "es", "it", "fr", "ro", "ca", "gl"];

		global.language = "en-us";

		for (var i = 0; i < array_length(latinos); i++) {
			if (lang == latinos[i]) {
				global.language = "pt-br";
				break;
			}
		}
	} else {
		global.language = idioma_ini;
	}
	
	global.background_index = ini_read_real("Background", "background", 0) mod array_length(global.backgrounds);
	global.volume = ini_read_real("Som", "volume", 1);
	global.tocar_som = bool(ini_read_real("Som", "tocar_selects", 1));
	global.init_fullscreen = bool(ini_read_real("GUI", "tela_cheia", 1));

	ini_close();
}