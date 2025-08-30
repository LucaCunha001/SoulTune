if (roominit == 0) {
	surface_resize(application_surface, room_width, room_height);
	roominit = 1;
}
if (delayA == delayB) {
	init_game();
	after_fullscreen_done();
}
if (delayA < delayB) {
	delayA++;
}