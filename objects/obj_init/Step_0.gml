if (waiting_fullscreen && window_get_fullscreen() == target_fullscreen) {
	waiting_fullscreen = false;
	after_fullscreen_done();
}