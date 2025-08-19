/// @function fullscreen()
/// @description Ativa o fullscreen caso a tecla vk_f4 esteja pressionada. 

function fullscreen() {
	if (keyboard_check_pressed(vk_f4)) {
		window_set_fullscreen(!window_get_fullscreen());
	}
}