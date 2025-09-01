#macro DISCORD_APP_ID 1403051221136179330

if !(os_type == os_windows || os_type == os_linux || os_type == os_macosx) {
	instance_destroy();
	exit;
}

global.discord_initialized = false;
iniciou = false;

function iniciar() {
	if (discord_init(string(DISCORD_APP_ID)) == 1) {
		iniciou = true;
		return true;
	}
	return false;
}

function atualizar_status() {
	if (!iniciou && !iniciar()) return false;

	global.discord_initialized = true;

	var state   = (string_length(global.musica_atual) > 0) ? global.musica_atual : scr_gettext("obj_discord_state");
	var details = scr_gettext("obj_discord_details");
	
	if (instance_exists(obj_creditos)) {
		details = scr_gettext("obj_discord_credits");
	}

	var start  = -global.current_music_time;
	var ending = global.is_playing? (global.music_duration - global.current_music_time) : 0.1;

	discord_update_timestamp(start, ending);
	discord_extra_info("icone", scr_gettext("obj_discord_interessou"), "", "");
	
	return discord_update_presence(state, details, 2);
}