if (mouse_check_button_pressed(mb_left)) {
	if (point_in_rectangle(mouse_x, mouse_y, btn_x1, btn_y1, btn_x2, btn_y2)) {
		instance_destroy();
	}
	else if (point_in_rectangle(mouse_x, mouse_y, btn2_x1, btn2_y1, btn2_x2, btn2_y2)) {
<<<<<<< HEAD
		url_open(global.repo_url);
=======
		url_open("https://github.com/LucaCunha001/SoulTune/releases/latest/");
>>>>>>> origin/main
	}
}