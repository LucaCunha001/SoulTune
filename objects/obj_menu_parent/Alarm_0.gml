if instance_exists(obj_chapter_select) || global.deltarune_cap == 0 {
	instance_create_depth(0, 0, depth, obj_music_selector);
} else {
	instance_create_depth(0, 0, depth, obj_chapter_select);
}

instance_destroy();