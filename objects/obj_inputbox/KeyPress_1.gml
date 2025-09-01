if (keyboard_check_pressed(vk_backspace)) {
	if (string_length(texto) > 0) {
		texto = string_delete(texto, string_length(texto), 1);
	}
} else if (keyboard_check_pressed(vk_enter)) {
	if (is_callable(confirm_callback)) {
		confirm_callback(texto);
	}
	keyboard_virtual_hide();
	instance_destroy();
} else {
	var key = keyboard_lastchar;
	var code = ord(key);
	if (code >= 32 && code <= 126) {
		texto += key;
	}
}