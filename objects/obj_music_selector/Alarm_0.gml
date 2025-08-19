if (hovered_section == 0) {
	instance_create_depth(0, 0, depth, simple_objects[hovered_btn]);
	instance_destroy();
} else if (hovered_section == 1) {
	global.filtro = string_lower(img_buttons[hovered_btn][0]);
	instance_create_depth(0, 0, depth, obj_music);
	instance_destroy();
}