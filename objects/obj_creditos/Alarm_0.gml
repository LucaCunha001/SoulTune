fase++;

if (fase >= array_length(creditos)) {
	if (slash) && !instance_exists(obj_writer) && criou_txt {
		instance_create_depth(0, 0, depth, obj_background);
		instance_create_depth(0, 0, depth-1, obj_config);
		audio_stop_all();
		tocar_musica(music_index[1], music_index[0], is_looping)
		instance_destroy();
	} else {
		if !(criou_txt) {
			slash = true;
			criou_txt = true;
			instance_create_depth(95, 80, depth-1, obj_writer);
		}
		alarm[0] = tempo;
	}
} else {
	alarm[0] = tempo;
}