hovered = -1;
for (var i=0; i<array_length(opcoes); i++) {
	if (point_in_rectangle(mouse_x, mouse_y, 100, 120+i*30, 300, 145+i*30)) {
		hovered = i;
		if (mouse_check_button_pressed(mb_left)) {
			if (is_callable(confirm_callback)) confirm_callback(opcoes[i]);
			instance_destroy();
		}
	}
}